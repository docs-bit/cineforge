import { Injectable } from '@nestjs/common';

const MODELS = [
  { id: 'sora-2', displayName: 'Sora 2', provider: 'OpenAI', capabilities: ['text-to-video', 'image-to-video'], creditsPerGeneration: 52, isAvailable: true },
  { id: 'veo-3.1', displayName: 'Veo 3.1', provider: 'Google', capabilities: ['text-to-video', 'image-to-video'], creditsPerGeneration: 48, isAvailable: true },
  { id: 'kling-3.0', displayName: 'Kling 3.0', provider: 'Kling AI', capabilities: ['text-to-video', 'image-to-video'], creditsPerGeneration: 45, isAvailable: true },
  { id: 'seedance-2.0', displayName: 'Seedance 2.0', provider: 'Seedance', capabilities: ['text-to-video'], creditsPerGeneration: 40, isAvailable: true },
  { id: 'wan-2.6', displayName: 'WAN 2.6', provider: 'WAN', capabilities: ['text-to-video', 'video-continuation'], creditsPerGeneration: 38, isAvailable: true },
  { id: 'flux-3.0', displayName: 'Flux 3.0', provider: 'Black Forest Labs', capabilities: ['text-to-video'], creditsPerGeneration: 35, isAvailable: true },
];

@Injectable()
export class ModelsService {
  findAll() {
    return MODELS;
  }

  findOne(id: string) {
    return MODELS.find(m => m.id === id) || null;
  }
}
