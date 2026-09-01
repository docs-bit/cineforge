import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { ModelsService } from '../models/models.service';
import { AdminService } from './admin.service';

@Controller('api/v1/admin')
@UseGuards(SupabaseAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService, private modelsService: ModelsService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() body: { isActive?: boolean; isAdmin?: boolean }) {
    return this.adminService.updateUser(id, body);
  }

  @Get('models')
  listModels() {
    return this.modelsService.findAllForAdmin();
  }
}
