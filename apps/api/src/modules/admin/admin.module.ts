import { Module } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ModelsModule } from '../models/models.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ModelsModule],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
