import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user';
import { BillingService } from './billing.service';

@Controller('api/v1/billing')
@UseGuards(SupabaseAuthGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('plans')
  getPlans() {
    return this.billingService.getPlans();
  }

  @Get('credits')
  getCreditBalance(@CurrentUser('id') userId: string) {
    return this.billingService.getCreditBalance(userId);
  }
}
