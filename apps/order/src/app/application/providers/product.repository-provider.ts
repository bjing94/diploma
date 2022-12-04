import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Product,
  ProductDocument,
} from '../../infrastructure/database/mongo/model/product.model';
import ProductRepository from '../../infrastructure/database/mongo/repository/product.repository';
import ProductAbstractRepository from '../repository/product.abstract-repository';

@Injectable()
export default class OrderEventSourceRepositoryProvider {
  public repository: ProductAbstractRepository;

  constructor(
    @InjectModel(Product.name)
    private readonly productRepository: Model<ProductDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new ProductRepository(this.productRepository);
  }
}
