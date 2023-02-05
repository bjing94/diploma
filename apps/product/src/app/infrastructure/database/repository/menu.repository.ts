import { MenuCreateDto } from '@burger-shop/interfaces';
import { Product } from '@burger-shop/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import MenuAbstractRepository from '../../../application/repository/menu.abstract-repository';
import { MenuDocument, MenuModel } from '../model/menu.model';

export default class MenuRepository implements MenuAbstractRepository {
  constructor(
    @InjectModel(MenuModel.name)
    private readonly _repository: Model<MenuDocument>
  ) {}

  public async find(id: number): Promise<MenuModel> {
    return this._repository.findOne({ id }).populate('items.product').exec();
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
    menu: any & { id: number }
  ): Promise<MenuModel> {
    return this._repository.findOneAndUpdate({ id }, menu).exec();
  }

  public async delete(id: number): Promise<void> {
    await this._repository.findOneAndDelete({ id }).exec();
  }

  public async getNextId() {
    const maxIdProduct = await this._repository.findOne().sort({ id: 'desc' });
    const maxId = maxIdProduct ? maxIdProduct.id + 1 : 1;
    return maxId;
  }
}
