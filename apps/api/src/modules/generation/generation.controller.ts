import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user';
import { GenerationService } from './generation.service';

@Controller('api/v1/generate')
@UseGuards(SupabaseAuthGuard)
export class GenerationController {
  constructor(private generationService: GenerationService) {}

  @Post()
  createJob(
    @CurrentUser('id') userId: string,
    @Body() dto: { modelId: string; inputType: string; inputData: any; parameters: any },
  ) {
    return this.generationService.createJob(userId, dto);
  }

  @Get(':jobId')
  getJobStatus(@Param('jobId') jobId: string) {
    return this.generationService.getJobStatus(jobId);
  }

  @Delete(':jobId')
  cancelJob(@Param('jobId') jobId: string, @CurrentUser('id') userId: string) {
    return this.generationService.cancelJob(jobId, userId);
  }
}
