import {
  CookingRequestCreatedEventPayload,
  CookingRequestGetQueryRequest,
  CookingRequestUpdatedEventPayload,
} from '@burger-shop/contracts';
import { Inject, Injectable } from '@nestjs/common';
import CookingRequestRepository from '../infrastructure/repository/cooking-request.repository';

@Injectable()
export default class KitchenQueryService {
  constructor(
    @Inject('CookingRequestRepository')
    private readonly repository: CookingRequestRepository
  ) {}

  public async onCookingRequestCreated(
    data: CookingRequestCreatedEventPayload
  ) {
    return this.repository.create(data);
  }

  public async onCookingRequestUpdated(
    data: CookingRequestUpdatedEventPayload
  ) {
    return this.repository.update(data);
  }

  public async getCookingRequest(data: CookingRequestGetQueryRequest) {
    return this.repository.findOne({ _id: data.id });
  }
}
