import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({ where: { userId }, select: { workspaceId: true } });
    const workspaceIds = memberships.map((membership) => membership.workspaceId);
    return this.prisma.project.findMany({ where: { OR: [{ createdById: userId }, { workspaceId: { in: workspaceIds } }] }, orderBy: { updatedAt: 'desc' } });
  }

  async create(userId: string, dto: CreateProjectDto) {
    const workspaceId = dto.workspaceId || (await this.prisma.workspaceMember.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' }, select: { workspaceId: true } }))?.workspaceId;
    if (!workspaceId) throw new ForbiddenException('A workspace is required to create a project');
    await this.assertWorkspaceAccess(userId, workspaceId, ['owner', 'admin', 'editor', 'member']);
    return this.prisma.project.create({ data: { name: dto.name, description: dto.description, workspaceId, createdById: userId, settings: (dto.settings || {}) as Prisma.InputJsonValue } });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    await this.assertProjectAccess(userId, project.workspaceId, project.createdById);
    return project;
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.findOne(id, userId);
    if (project.workspaceId) await this.assertWorkspaceAccess(userId, project.workspaceId, ['owner', 'admin', 'editor']);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const project = await this.findOne(id, userId);
    if (project.workspaceId) await this.assertWorkspaceAccess(userId, project.workspaceId, ['owner', 'admin']);
    return this.prisma.project.delete({ where: { id } });
  }

  private async assertProjectAccess(userId: string, workspaceId: string | null, createdById: string | null) {
    if (workspaceId) {
      await this.assertWorkspaceAccess(userId, workspaceId, ['owner', 'admin', 'editor', 'member']);
      return;
    }
    if (createdById !== userId) throw new ForbiddenException('You do not have access to this project');
  }

  private async assertWorkspaceAccess(userId: string, workspaceId: string, allowedRoles: string[]) {
    const membership = await this.prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId } }, select: { role: true } });
    if (!membership || !allowedRoles.includes(membership.role)) throw new ForbiddenException('You do not have access to this workspace');
  }
}
