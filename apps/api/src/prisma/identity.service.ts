import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

type AuthIdentity = { id: string; email?: string | null; user_metadata?: Record<string, unknown> };

@Injectable()
export class IdentityService {
  constructor(private prisma: PrismaService) {}

  async ensureProfile(identity: AuthIdentity) {
    const email = identity.email?.trim().toLowerCase();
    if (!email) throw new UnauthorizedException('Authenticated user has no email');
    const displayName = typeof identity.user_metadata?.full_name === 'string' ? identity.user_metadata.full_name : email.split('@')[0];

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({ where: { id: identity.id }, update: { email, displayName, lastActiveAt: new Date() }, create: { id: identity.id, email, displayName, lastActiveAt: new Date() } });
      const existingMembership = await tx.workspaceMember.findFirst({ where: { userId: identity.id }, include: { workspace: true } });
      if (existingMembership) return { user, workspace: existingMembership.workspace, role: existingMembership.role };

      const workspace = await tx.workspace.create({ data: { name: `${displayName}'s Studio`, slug: `studio-${identity.id.slice(0, 8)}`, ownerId: identity.id } });
      const membership = await tx.workspaceMember.create({ data: { userId: identity.id, workspaceId: workspace.id, role: 'owner' } });
      return { user, workspace, role: membership.role };
    });
  }
}
