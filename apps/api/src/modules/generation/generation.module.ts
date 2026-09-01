import { Module } from '@nestjs/common';
import { GenerationController } from './generation.controller';
import { GenerationService } from './generation.service';
import { ProviderRouterService } from './provider-router.service';

@Module({
  controllers: [GenerationController],
  providers: [GenerationService, ProviderRouterService],
  exports: [GenerationService, ProviderRouterService],
})
export class GenerationModule {}
