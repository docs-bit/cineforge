import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto, UpdateCanvasDto } from './dto/canvas.dto';

@Controller('api/v1/canvases')
@UseGuards(SupabaseAuthGuard)
export class CanvasController {
  constructor(private canvasService: CanvasService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.canvasService.findAll(userId);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCanvasDto) {
    return this.canvasService.create(userId, { ...dto, nodes: dto.nodes as Prisma.InputJsonValue | undefined, edges: dto.edges as Prisma.InputJsonValue | undefined, viewport: dto.viewport as Prisma.InputJsonValue | undefined });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.canvasService.findOne(id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UpdateCanvasDto) {
    return this.canvasService.update(id, userId, { ...dto, nodes: dto.nodes as Prisma.InputJsonValue | undefined, edges: dto.edges as Prisma.InputJsonValue | undefined, viewport: dto.viewport as Prisma.InputJsonValue | undefined });
  }
}
