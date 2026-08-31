import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user';
import { CanvasService } from './canvas.service';

@Controller('api/v1/canvases')
@UseGuards(SupabaseAuthGuard)
export class CanvasController {
  constructor(private canvasService: CanvasService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.canvasService.findAll(userId);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: { name: string; projectId?: string }) {
    return this.canvasService.create(userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.canvasService.findOne(id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: { nodes?: any; edges?: any; viewport?: any; name?: string }) {
    return this.canvasService.update(id, userId, dto);
  }
}
