import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { AdminService } from './admin.service';

@Controller('api/v1/admin')
@UseGuards(SupabaseAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: { isActive?: boolean; isAdmin?: boolean }) {
    return this.adminService.updateUser(id, dto);
  }
}
