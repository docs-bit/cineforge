import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { id?: string } }>();
    const userId = request.user?.id;
    if (!userId) throw new ForbiddenException('Authenticated user is required');
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true, isActive: true } });
    if (!user?.isActive || !user.isAdmin) throw new ForbiddenException('Admin access required');
    return true;
  }
}
