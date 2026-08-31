import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async listUsers() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateUser(id: string, dto: { isActive?: boolean; isAdmin?: boolean }) {
    return this.prisma.user.update({ where: { id }, data: dto });
  }
}
