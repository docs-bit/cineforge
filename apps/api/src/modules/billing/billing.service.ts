import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const PLANS = [
  { id: 'free', name: 'Free', credits: 5, price: 0 },
  { id: 'starter', name: 'Starter', credits: 270, price: 19 },
  { id: 'plus', name: 'Plus', credits: 1200, price: 47 },
  { id: 'ultra', name: 'Ultra', credits: 3000, price: 99 },
];

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  getPlans() {
    return PLANS;
  }

  async getCreditBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { creditsBalance: true },
    });
    return { credits: user?.creditsBalance ?? 0 };
  }
}
