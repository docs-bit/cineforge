import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { CharactersModule } from './modules/characters/characters.module';
import { GenerationModule } from './modules/generation/generation.module';
import { ModelsModule } from './modules/models/models.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const required = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
        const missing = required.filter((key) => !config[key]);
        if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        return config;
      },
    }),
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
  controllers: [HealthController],
})
export class AppModule {}
