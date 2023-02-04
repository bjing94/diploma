import { Model } from 'mongoose';
import ProductAbstractRepository from '../../../application/repository/product.abstract-repository';
import { Product, ProductDocument } from '@burger-shop/models';
import { InjectModel } from '@nestjs/mongoose';
import ProductCreateDto from '../../../interfaces/product.create.dto';
import ProductUpdateDto from '../../../interfaces/product.update.dto';

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

  public async create(product: ProductCreateDto): Promise<Product> {
    const maxIdProduct = await this.model.findOne().sort({ id: 'desc' });
    const maxId = maxIdProduct ? maxIdProduct.id + 1 : 1;
    return this.model.create({ ...product, id: maxId });
  }

  public async update(id: number, product: ProductUpdateDto): Promise<Product> {
    return this.model.findOneAndUpdate({ id }, product).exec();
  }

  public async delete(id: number): Promise<void> {
    await this.model.findOneAndDelete({ id }).exec();
  }
}
