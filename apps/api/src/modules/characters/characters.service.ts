import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type CharacterPayload = { name: string; workspaceId?: string; referenceImages?: string[]; provenanceNotes?: string; consentStatus?: string };

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, workspaceId?: string) {
    const memberships = await this.prisma.workspaceMember.findMany({ where: { userId, ...(workspaceId ? { workspaceId } : {}) }, select: { workspaceId: true } });
    const workspaceIds = memberships.map((membership) => membership.workspaceId);
    return this.prisma.character.findMany({ where: { workspaceId: { in: workspaceIds } }, orderBy: { updatedAt: 'desc' } });
  }

  async findOne(id: string, userId: string) {
    const character = await this.prisma.character.findUnique({ where: { id } });
    if (!character) throw new NotFoundException('Character not found');
    if (!character.workspaceId || !(await this.hasWorkspaceAccess(userId, character.workspaceId))) throw new NotFoundException('Character not found');
    return character;
  }

  async create(userId: string, dto: CharacterPayload) {
    if (dto.consentStatus !== 'confirmed') throw new BadRequestException('Documented consent is required');
    if (!dto.referenceImages || dto.referenceImages.length < 3) throw new BadRequestException('At least three reference images are required');
    const workspaceId = dto.workspaceId || (await this.prisma.workspaceMember.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' }, select: { workspaceId: true } }))?.workspaceId;
    if (!workspaceId || !(await this.hasWorkspaceAccess(userId, workspaceId))) throw new ForbiddenException('You do not have access to this workspace');
    return this.prisma.character.create({ data: { name: dto.name, workspaceId, createdById: userId, referenceImages: dto.referenceImages as Prisma.InputJsonValue, provenanceNotes: dto.provenanceNotes, consentStatus: 'confirmed', trainingStatus: 'untrained' } });
  }

  async train(id: string, userId: string) {
    const character = await this.findOne(id, userId);
    if (character.consentStatus !== 'confirmed') throw new BadRequestException('Documented consent is required before training');
    if (!Array.isArray(character.referenceImages) || character.referenceImages.length < 3) throw new BadRequestException('At least three reference images are required before training');
    return this.prisma.character.update({ where: { id }, data: { trainingStatus: 'queued' } });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.character.delete({ where: { id } });
  }

  private hasWorkspaceAccess(userId: string, workspaceId: string) {
    return this.prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId } }, select: { id: true } }).then(Boolean);
  }
}
