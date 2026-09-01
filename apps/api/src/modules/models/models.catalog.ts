export type ModelCapability = 'text-to-video' | 'image-to-video' | 'text-to-image' | 'video-continuation' | 'audio-generation';

export type ModelCatalogueEntry = {
  id: string;
  version: string;
  displayName: string;
  provider: string;
  adapter: string;
  capabilities: ModelCapability[];
  creditsPerFiveSeconds: number;
  maxDurationSeconds: number;
  entitlement: 'free' | 'creator' | 'studio';
  safetyPolicy: 'standard' | 'identity-safe' | 'brand-safe';
  maxConcurrentJobs: number;
  health: 'staged' | 'healthy' | 'degraded' | 'offline';
  approved: boolean;
  credentialReady: boolean;
  customerVisible: boolean;
};

export const MODEL_CATALOGUE: ModelCatalogueEntry[] = [
  { id: 'sora-2', version: 'sora-2', displayName: 'Sora 2', provider: 'OpenAI', adapter: 'openai-video', capabilities: ['text-to-video', 'image-to-video'], creditsPerFiveSeconds: 52, maxDurationSeconds: 20, entitlement: 'studio', safetyPolicy: 'standard', maxConcurrentJobs: 2, health: 'staged', approved: false, credentialReady: false, customerVisible: false },
  { id: 'veo-3.1', version: 'veo-3.1', displayName: 'Veo 3.1', provider: 'Google', adapter: 'google-video', capabilities: ['text-to-video', 'image-to-video'], creditsPerFiveSeconds: 48, maxDurationSeconds: 30, entitlement: 'studio', safetyPolicy: 'standard', maxConcurrentJobs: 2, health: 'staged', approved: false, credentialReady: false, customerVisible: false },
  { id: 'kling-3.0', version: 'kling-3.0', displayName: 'Kling 3.0', provider: 'Kling AI', adapter: 'kling-video', capabilities: ['text-to-video', 'image-to-video'], creditsPerFiveSeconds: 45, maxDurationSeconds: 15, entitlement: 'creator', safetyPolicy: 'standard', maxConcurrentJobs: 3, health: 'staged', approved: false, credentialReady: false, customerVisible: false },
  { id: 'seedance-2.0', version: 'seedance-2.0', displayName: 'Seedance 2.0', provider: 'ByteDance', adapter: 'bytedance-video', capabilities: ['text-to-video'], creditsPerFiveSeconds: 40, maxDurationSeconds: 10, entitlement: 'creator', safetyPolicy: 'standard', maxConcurrentJobs: 2, health: 'staged', approved: false, credentialReady: false, customerVisible: false },
  { id: 'wan-2.6', version: 'wan-2.6', displayName: 'WAN 2.6', provider: 'Alibaba', adapter: 'wan-video', capabilities: ['text-to-video', 'video-continuation'], creditsPerFiveSeconds: 38, maxDurationSeconds: 10, entitlement: 'creator', safetyPolicy: 'standard', maxConcurrentJobs: 3, health: 'staged', approved: false, credentialReady: false, customerVisible: false },
  { id: 'flux-3.0', version: 'flux-3.0', displayName: 'Flux 3.0', provider: 'Black Forest Labs', adapter: 'bfl-image', capabilities: ['text-to-image'], creditsPerFiveSeconds: 35, maxDurationSeconds: 1, entitlement: 'free', safetyPolicy: 'brand-safe', maxConcurrentJobs: 4, health: 'staged', approved: false, credentialReady: false, customerVisible: false },
];
