import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GenerationService {
  constructor(private prisma: PrismaService) {}

  async createJob(userId: string, dto: { modelId: string; inputType: string; inputData: any; parameters: any }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    const creditsNeeded = this.calculateCredits(dto.modelId, dto.parameters);

    if (user.creditsBalance < creditsNeeded) {
      throw new BadRequestException('Insufficient credits');
    }

    const [job] = await this.prisma.$transaction([
      this.prisma.generationJob.create({
        data: {
          userId,
          modelId: dto.modelId,
          inputType: dto.inputType,
          inputData: dto.inputData,
          parameters: dto.parameters,
          creditsUsed: creditsNeeded,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { creditsBalance: { decrement: creditsNeeded } },
      }),
    ]);

    return job;
  }

  async getJobStatus(jobId: string) {
    const job = await this.prisma.generationJob.findUnique({ where: { id: jobId } });
    if (!job) throw new BadRequestException('Job not found');
    return job;
  }

  async cancelJob(jobId: string, userId: string) {
    const job = await this.prisma.generationJob.findUnique({ where: { id: jobId } });
    if (!job || job.userId !== userId) throw new BadRequestException('Job not found');
    if (job.status !== 'pending') throw new BadRequestException('Job already processing');

    await this.prisma.$transaction([
      this.prisma.generationJob.update({
        where: { id: jobId },
        data: { status: 'failed', errorMessage: 'Cancelled by user' },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { creditsBalance: { increment: job.creditsUsed } },
      }),
    ]);

    return { message: 'Job cancelled' };
  }

  private calculateCredits(modelId: string, _parameters: any): number {
    const baseCredits: Record<string, number> = {
      'sora-2': 52, 'veo-3.1': 48, 'kling-3.0': 45,
      'seedance-2.0': 40, 'wan-2.6': 38, 'flux-3.0': 35,
    };
    return baseCredits[modelId] || 30;
  }
}
