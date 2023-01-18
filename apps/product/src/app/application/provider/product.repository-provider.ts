import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../infrastructure/database/model/product.model';
import ProductRepository from '../../infrastructure/database/repository/product.repository';
import ProductAbstractRepository from '../repository/product.abstract-repository';

@Injectable()
export default class ProductRepositoryProvider {
  public repository: ProductAbstractRepository;

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new ProductRepository(this.productModel);
  }
}
