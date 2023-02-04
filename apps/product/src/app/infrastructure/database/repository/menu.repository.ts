import { MenuCreate } from '@burger-shop/contracts';
import { MenuCreateDto } from '@burger-shop/interfaces';
import { Model } from 'mongoose';
import MenuAbstractRepository from '../../../application/repository/menu.abstract-repository';
import { MenuDocument, MenuModel } from '../model/menu.model';

export default class MenuRepository implements MenuAbstractRepository {
  private _repository: Model<MenuDocument>;

  constructor(repository: Model<MenuDocument>) {
    this._repository = repository;
  }

  public async find(id: number): Promise<MenuModel> {
    return this._repository
      .findOne({ id })
      .populate({
        path: 'item',
        populate: {
          path: 'product',
          model: 'Product',
        },
      })
      .exec();
  }

  public async findMany(take: number, skip: number): Promise<MenuModel[]> {
    return this._repository.find().limit(take).skip(skip).exec();
  }

  public async create(menu: MenuCreateDto): Promise<MenuModel> {
    const { id, items } = menu;
    return this._repository.create({
      id,
      items: items.map((item) => {
        return {
          id: item.id,
          price: item.price,
          available: item.available,
          product: item.product,
        };
      }),
    });
  }

  public async update(
    id: number,
    menu: MenuCreate.Request & { id: number }
  ): Promise<MenuModel> {
    return this._repository.findOneAndUpdate({ id }, menu).exec();
  }

  public async delete(id: number): Promise<void> {
    await this._repository.findOneAndDelete({ id }).exec();
  }
}
