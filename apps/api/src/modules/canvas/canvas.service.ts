import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CanvasService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.canvas.findMany({
      where: { createdById: userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const canvas = await this.prisma.canvas.findUnique({ where: { id } });
    if (!canvas) throw new NotFoundException('Canvas not found');
    if (canvas.createdById !== userId) throw new NotFoundException('Canvas not found');
    return canvas;
  }

  async create(userId: string, dto: { name: string; projectId?: string }) {
    return this.prisma.canvas.create({
      data: { name: dto.name, projectId: dto.projectId, createdById: userId },
    });
  }

  async update(id: string, userId: string, dto: { nodes?: any; edges?: any; viewport?: any; name?: string }) {
    await this.findOne(id, userId);
    return this.prisma.canvas.update({ where: { id }, data: dto });
  }
}
