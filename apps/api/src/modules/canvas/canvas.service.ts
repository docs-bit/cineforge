import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type CanvasPayload = { name?: string; projectId?: string; nodes?: Prisma.InputJsonValue; edges?: Prisma.InputJsonValue; viewport?: Prisma.InputJsonValue };

@Injectable()
export class CanvasService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({ where: { userId }, select: { workspaceId: true } });
    return this.prisma.canvas.findMany({ where: { OR: [{ createdById: userId }, { project: { workspaceId: { in: memberships.map((membership) => membership.workspaceId) } } }] }, orderBy: { updatedAt: 'desc' } });
  }

  async findOne(id: string, userId: string) {
    const canvas = await this.prisma.canvas.findUnique({ where: { id } });
    if (!canvas) throw new NotFoundException('Canvas not found');
    if (canvas.createdById === userId) return canvas;
    if (canvas.projectId) {
      const project = await this.prisma.project.findUnique({ where: { id: canvas.projectId }, select: { workspaceId: true } });
      if (project?.workspaceId && await this.hasWorkspaceAccess(userId, project.workspaceId)) return canvas;
    }
    throw new NotFoundException('Canvas not found');
  }

  async create(userId: string, dto: CanvasPayload) {
    if (!dto.name) throw new ForbiddenException('Canvas name is required');
    if (dto.projectId) {
      const project = await this.prisma.project.findUnique({ where: { id: dto.projectId }, select: { workspaceId: true } });
      if (!project?.workspaceId || !(await this.hasWorkspaceAccess(userId, project.workspaceId))) throw new ForbiddenException('You do not have access to this project');
    }
    return this.prisma.canvas.create({ data: { name: dto.name, projectId: dto.projectId, createdById: userId, nodes: dto.nodes || [], edges: dto.edges || [], viewport: dto.viewport || { x: 0, y: 0, zoom: 1 } } });
  }

  async update(id: string, userId: string, dto: CanvasPayload) {
    await this.findOne(id, userId);
    return this.prisma.canvas.update({ where: { id }, data: { ...dto, nodes: dto.nodes, edges: dto.edges, viewport: dto.viewport } });
  }

  private hasWorkspaceAccess(userId: string, workspaceId: string) {
    return this.prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId } }, select: { id: true } }).then(Boolean);
  }
}
