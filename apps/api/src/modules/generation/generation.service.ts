import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MODEL_CATALOGUE } from '../models/models.catalog';

type GenerationPayload = {
  modelId: string;
  inputType: string;
  inputData: Prisma.InputJsonValue;
  parameters: Prisma.InputJsonValue;
  projectId?: string;
  idempotencyKey?: string;
};

@Injectable()
export class GenerationService {
  constructor(private prisma: PrismaService) {}

  async createJob(userId: string, dto: GenerationPayload) {
    if (dto.idempotencyKey) {
      const existing = await this.prisma.generationJob.findFirst({ where: { userId, idempotencyKey: dto.idempotencyKey } });
      if (existing) return existing;
    }

    const model = MODEL_CATALOGUE.find((entry) => entry.id === dto.modelId);
    if (!model || !model.approved || !model.credentialReady || !model.customerVisible || model.health === 'offline') throw new BadRequestException('Model is not currently available');
    const credits = this.calculateCredits(model.creditsPerFiveSeconds, dto.parameters);
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId }, select: { creditsBalance: true } });
      if (!user) throw new BadRequestException('User not found');
      if (user.creditsBalance < credits) throw new BadRequestException('Insufficient credits');

      const job = await tx.generationJob.create({
        data: {
          userId,
          projectId: dto.projectId,
          modelId: dto.modelId,
          inputType: dto.inputType,
          inputData: dto.inputData,
          parameters: dto.parameters,
          status: 'queued',
          creditsUsed: 0,
          reservedCredits: credits,
          idempotencyKey: dto.idempotencyKey,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });

      const updatedUser = await tx.user.update({ where: { id: userId }, data: { creditsBalance: { decrement: credits } }, select: { creditsBalance: true } });
      await tx.creditLedgerEntry.create({
        data: {
          userId,
          generationJobId: job.id,
          type: 'reserve',
          amount: -credits,
          balanceAfter: updatedUser.creditsBalance,
          reason: `Reserved for ${dto.modelId}`,
          metadata: { modelId: dto.modelId, inputType: dto.inputType },
        },
      });
      return job;
    });
  }

  async findAll(userId: string) {
    return this.prisma.generationJob.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async getJobStatus(jobId: string, userId: string) {
    const job = await this.prisma.generationJob.findFirst({ where: { id: jobId, userId } });
    if (!job) throw new NotFoundException('Generation job not found');
    return job;
  }

  async cancelJob(jobId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const job = await tx.generationJob.findFirst({ where: { id: jobId, userId } });
      if (!job) throw new NotFoundException('Generation job not found');
      if (!['queued', 'pending', 'processing'].includes(job.status)) throw new BadRequestException('Job cannot be cancelled in its current state');

      const refund = job.reservedCredits || job.creditsUsed;
      const updatedUser = await tx.user.update({ where: { id: userId }, data: { creditsBalance: { increment: refund } }, select: { creditsBalance: true } });
      const cancelled = await tx.generationJob.update({ where: { id: jobId }, data: { status: 'cancelled', errorMessage: 'Cancelled by user', reservedCredits: 0 } });
      await tx.creditLedgerEntry.create({ data: { userId, generationJobId: job.id, type: 'release', amount: refund, balanceAfter: updatedUser.creditsBalance, reason: 'Generation job cancelled' } });
      return cancelled;
    });
  }

  async claimJob(jobId: string, providerJobId: string) {
    const claimed = await this.prisma.generationJob.updateMany({ where: { id: jobId, status: 'queued', retryCount: { lt: 3 } }, data: { status: 'processing', providerJobId } });
    return claimed.count ? this.prisma.generationJob.findUnique({ where: { id: jobId } }) : null;
  }

  async retryJob(jobId: string) {
    const retried = await this.prisma.generationJob.updateMany({ where: { id: jobId, status: { in: ['failed', 'processing'] }, retryCount: { lt: 3 } }, data: { status: 'queued', retryCount: { increment: 1 }, errorMessage: null } });
    return retried.count ? this.prisma.generationJob.findUnique({ where: { id: jobId } }) : null;
  }

  async markProcessing(jobId: string, providerJobId: string) {
    return this.claimJob(jobId, providerJobId);
  }

  async markCompleted(jobId: string, resultUrls: string[]) {
    return this.prisma.$transaction(async (tx) => {
      const job = await tx.generationJob.findUnique({ where: { id: jobId } });
      if (!job) throw new NotFoundException('Generation job not found');
      return tx.generationJob.update({ where: { id: jobId }, data: { status: 'completed', resultUrls, creditsUsed: job.reservedCredits, reservedCredits: 0, completedAt: new Date() } });
    });
  }

  async markFailed(jobId: string, errorMessage: string) {
    return this.prisma.$transaction(async (tx) => {
      const job = await tx.generationJob.findUnique({ where: { id: jobId } });
      if (!job) throw new NotFoundException('Generation job not found');
      if (job.status === 'failed' || job.status === 'cancelled' || job.status === 'completed') return job;
      const refund = job.reservedCredits;
      const failed = await tx.generationJob.update({ where: { id: jobId }, data: { status: 'failed', errorMessage, reservedCredits: 0 } });
      if (job.userId && refund > 0) {
        const user = await tx.user.update({ where: { id: job.userId }, data: { creditsBalance: { increment: refund } }, select: { creditsBalance: true } });
        await tx.creditLedgerEntry.create({ data: { userId: job.userId, generationJobId: job.id, type: 'release', amount: refund, balanceAfter: user.creditsBalance, reason: 'Generation job failed' } });
      }
      return failed;
    });
  }

  private calculateCredits(creditsPerFiveSeconds: number, parameters: Prisma.InputJsonValue): number {
    const record = typeof parameters === 'object' && parameters !== null && !Array.isArray(parameters) ? parameters as Record<string, unknown> : {};
    const duration = typeof record.duration === 'number' ? Math.min(30, Math.max(1, record.duration)) : 5;
    return Math.max(1, Math.ceil(creditsPerFiveSeconds * (duration / 5)));
  }
}
