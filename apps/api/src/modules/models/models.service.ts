import { Injectable } from '@nestjs/common';
import { MODEL_CATALOGUE } from './models.catalog';

@Injectable()
export class ModelsService {
  findAll() {
    return MODEL_CATALOGUE.filter((model) => model.customerVisible && model.approved && model.credentialReady && model.health !== 'offline');
  }

  findAllForAdmin() {
    return MODEL_CATALOGUE;
  }

  findOne(id: string) {
    return this.findAll().find((model) => model.id === id) || null;
  }

  findOneForAdmin(id: string) {
    return MODEL_CATALOGUE.find((model) => model.id === id) || null;
  }
}
