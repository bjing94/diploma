import { FilterQuery, Model } from 'mongoose';
import ProductAbstractRepository from '../../../application/repository/product.abstract-repository';
import { Product, ProductDocument } from '@burger-shop/models';
import { InjectModel } from '@nestjs/mongoose';
import ProductCreateDto from '../../../interfaces/product.create.dto';
import ProductUpdateDto from '../../../interfaces/product.update.dto';
import { Types } from 'mongoose';
import { READ_CONNECTION_NAME } from '../../../config/mongoose.config';

export default class ProductRepository implements ProductAbstractRepository {
  constructor(
    @InjectModel(Product.name, READ_CONNECTION_NAME)
    private readonly model: Model<ProductDocument>
  ) {}

  public async clearAll(): Promise<void> {
    await this.model.deleteMany().exec();
  }

  public async find(id: string) {
    return this.model.findById(id).exec();
  }

  public async findMany(
    filter: FilterQuery<ProductDocument>,
    take: number,
    skip: number
  ): Promise<ProductDocument[]> {
    console.log(filter);
    return this.model.find(filter).limit(take).skip(skip).exec();
  }

  public async create(product: ProductCreateDto): Promise<ProductDocument> {
    return this.model.create({
      _id: new Types.ObjectId(product.id),
      name: product.name,
      imgLink: product.imgLink,
    });
  }

  public async update(
    id: string,
    product: ProductUpdateDto
  ): Promise<ProductDocument> {
    return this.model.findByIdAndUpdate(id, product).exec();
  }

  public async deactivate(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { active: false }).exec();
  }
}
