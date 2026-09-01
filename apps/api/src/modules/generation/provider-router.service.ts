import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { MODEL_CATALOGUE } from '../models/models.catalog';

export type ProviderSubmitRequest = {
  modelId: string;
  inputType: string;
  inputData: Record<string, unknown>;
  parameters: Record<string, unknown>;
};

export type ProviderSubmitResult = { providerJobId: string; status: 'processing' | 'queued' };

export interface ProviderAdapter {
  readonly id: string;
  readonly configured: boolean;
  submit(request: ProviderSubmitRequest): Promise<ProviderSubmitResult>;
  cancel(providerJobId: string): Promise<void>;
}

@Injectable()
export class ProviderRouterService {
  private readonly adapters = new Map<string, ProviderAdapter>();

  async submit(request: ProviderSubmitRequest): Promise<ProviderSubmitResult> {
    const model = MODEL_CATALOGUE.find((entry) => entry.id === request.modelId);
    if (!model || !model.approved || !model.customerVisible) throw new BadRequestException('Model is not approved for customer generation');
    const adapter = this.adapters.get(model.adapter);
    if (!adapter || !adapter.configured) throw new ServiceUnavailableException('Provider is not configured for this model');
    return adapter.submit(request);
  }

  async cancel(modelId: string, providerJobId: string) {
    const model = MODEL_CATALOGUE.find((entry) => entry.id === modelId);
    const adapter = model ? this.adapters.get(model.adapter) : undefined;
    if (adapter?.configured) await adapter.cancel(providerJobId);
  }

  register(adapter: ProviderAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  health() {
    return MODEL_CATALOGUE.map((model) => ({ modelId: model.id, adapter: model.adapter, configured: this.adapters.get(model.adapter)?.configured ?? false, approved: model.approved, health: model.health }));
  }
}
