import { Model } from 'mongoose';
import ProductAbstractRepository from '../../../application/repository/product.abstract-repository';
import { Product, ProductDocument } from '@burger-shop/models';
import { ProductCreate, ProductUpdate } from '@burger-shop/contracts';
import { InjectModel } from '@nestjs/mongoose';

export default class ProductRepository implements ProductAbstractRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly model: Model<ProductDocument>
  ) {}

  public async find(id: number) {
    return this.model.findOne({ id }).exec();
  }

  public async findMany(take: number, skip: number): Promise<Product[]> {
    return this.model.find().limit(take).skip(skip).exec();
  }

  public async create(product: ProductCreate.Request): Promise<Product> {
    return this.model.create(product);
  }

  public async update(
    id: number,
    product: ProductUpdate.Request
  ): Promise<Product> {
    return this.model.findOneAndUpdate({ id }, product).exec();
  }

  public async delete(id: number): Promise<void> {
    await this.model.findOneAndDelete({ id }).exec();
  }
}
