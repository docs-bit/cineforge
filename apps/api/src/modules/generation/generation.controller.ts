import { Body, Controller, Delete, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user';
import { GenerationService } from './generation.service';
import { CreateGenerationDto } from './dto/create-generation.dto';

@Controller('api/v1/generate')
@UseGuards(SupabaseAuthGuard)
export class GenerationController {
  constructor(private generationService: GenerationService) {}

  @Post()
  createJob(@CurrentUser('id') userId: string, @Headers('idempotency-key') headerKey: string | undefined, @Body() dto: CreateGenerationDto) {
    return this.generationService.createJob(userId, { ...dto, inputData: dto.inputData as Prisma.InputJsonValue, parameters: dto.parameters as Prisma.InputJsonValue, idempotencyKey: dto.idempotencyKey || headerKey });
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.generationService.findAll(userId);
  }

  @Get(':jobId')
  getJobStatus(@Param('jobId') jobId: string, @CurrentUser('id') userId: string) {
    return this.generationService.getJobStatus(jobId, userId);
  }

  @Delete(':jobId')
  cancelJob(@Param('jobId') jobId: string, @CurrentUser('id') userId: string) {
    return this.generationService.cancelJob(jobId, userId);
  }
}
