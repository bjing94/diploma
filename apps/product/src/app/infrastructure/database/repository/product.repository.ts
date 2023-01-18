import { Model } from 'mongoose';
import ProductAbstractRepository from '../../../application/repository/product.abstract-repository';
import { Product, ProductDocument } from '../model/product.model';

export default class ProductRepository implements ProductAbstractRepository {
  private _repository: Model<ProductDocument>;

  constructor(repository: Model<ProductDocument>) {
    this._repository = repository;
  }

  public async find(id: number): Promise<Product> {
    return this._repository.findOne({ id }).exec();
  }

  public async findMany(take: number, skip: number): Promise<Product[]> {
    return this._repository.find().limit(take).skip(skip).exec();
  }

  public async create(order: Product): Promise<Product> {
    return this._repository.create(order);
  }

  public async update(id: number, order: Product): Promise<Product> {
    return this._repository.findOneAndUpdate({ id }, order).exec();
  }

  public async delete(id: number): Promise<void> {
    await this._repository.findOneAndDelete({ id }).exec();
  }
}
