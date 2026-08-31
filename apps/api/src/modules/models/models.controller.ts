import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { ModelsService } from './models.service';

@Controller('api/v1/models')
@UseGuards(SupabaseAuthGuard)
export class ModelsController {
  constructor(private modelsService: ModelsService) {}

  @Get()
  findAll() {
    return this.modelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const model = this.modelsService.findOne(id);
    if (!model) throw new NotFoundException('Model not found');
    return model;
  }
}
