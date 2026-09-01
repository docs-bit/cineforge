import { Global, Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, IdentityService],
  exports: [PrismaService, IdentityService],
})
export class PrismaModule {}
