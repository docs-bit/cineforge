import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, workspaceId?: string) {
    return this.prisma.character.findMany({
      where: { createdById: userId, ...(workspaceId ? { workspaceId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const char = await this.prisma.character.findUnique({ where: { id } });
    if (!char) throw new NotFoundException('Character not found');
    if (char.createdById !== userId) throw new NotFoundException('Character not found');
    return char;
  }

  async create(userId: string, dto: { name: string; workspaceId?: string }) {
    return this.prisma.character.create({
      data: { name: dto.name, workspaceId: dto.workspaceId, createdById: userId },
    });
  }

  async train(id: string, userId: string) {
    await this.findOne(id, userId);
    return { message: 'Training initiated', characterId: id };
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.character.delete({ where: { id } });
  }
}
