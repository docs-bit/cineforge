import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { GenerationModule } from './modules/generation/generation.module';
import { ModelsModule } from './modules/models/models.module';
import { CharactersModule } from './modules/characters/characters.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    GenerationModule,
    ModelsModule,
    CharactersModule,
    CanvasModule,
    BillingModule,
    AdminModule,
  ],
})
export class AppModule {}
