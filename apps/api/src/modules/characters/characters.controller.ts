import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('api/v1/characters')
@UseGuards(SupabaseAuthGuard)
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query('workspaceId') workspaceId?: string) {
    return this.charactersService.findAll(userId, workspaceId);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCharacterDto) {
    return this.charactersService.create(userId, dto);
  }

  @Post(':id/train')
  train(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.charactersService.train(id, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.charactersService.findOne(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.charactersService.remove(id, userId);
  }
}
