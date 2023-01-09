import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateOrderSagaDocument,
  CreateOrderSagaModel,
} from '../../infrastructure/database/mongo/model/create-order-saga.model';
import CreateOrderSagaRepository from '../../infrastructure/database/mongo/repository/create-order-saga.repository';

@Injectable()
export default class CreateOrderSagaRepositoryProvider {
  public repository: CreateOrderSagaRepository;

  constructor(
    @InjectModel(CreateOrderSagaModel.name)
    private readonly eventModel: Model<CreateOrderSagaDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new CreateOrderSagaRepository(this.eventModel);
  }
}
