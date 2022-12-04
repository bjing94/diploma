import { Model } from 'mongoose';
import ProductAbstractRepository from '../../../../application/repository/product.abstract-repository';
import { Product, ProductDocument } from '../model/product.model';

export default class ProductRepository implements ProductAbstractRepository {
  private _repository: Model<ProductDocument>;

  constructor(repository: Model<ProductDocument>) {
    this._repository = repository;
  }

  public async find(id: string): Promise<Product> {
    return this._repository.findById(id).exec();
  }

  public async findMany(ids: string[]): Promise<Product[]> {
    return this._repository.find({ _id: { $in: ids } }).exec();
  }

  public async create(order: Product): Promise<Product> {
    return this._repository.create(order);
  }

  public async update(id: string, order: Product): Promise<Product> {
    return this._repository.findByIdAndUpdate(id, order).exec();
  }

  public async delete(id: string): Promise<void> {
    await this._repository.findByIdAndDelete(id).exec();
  }
}
