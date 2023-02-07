import { MenuCreateDto } from '@burger-shop/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import MenuAbstractRepository from '../../../application/repository/menu.abstract-repository';
import { MenuDocument, MenuModel } from '../model/menu.model';

export default class MenuRepository implements MenuAbstractRepository {
  constructor(
    @InjectModel(MenuModel.name)
    private readonly _repository: Model<MenuDocument>
  ) {}

  public async find(id: string): Promise<MenuModel> {
    return this._repository.findById(id).populate('items.product').exec();
  }

  public async findMany(take: number, skip: number): Promise<MenuModel[]> {
    return this._repository.find().limit(take).skip(skip).exec();
  }

  public async create(menu: MenuCreateDto): Promise<MenuModel> {
    const { id, items } = menu;
    return this._repository.create({
      _id: new Types.ObjectId(id),
      items: items,
    });
  }

  public async update(
    id: string,
    menu: any & { id: number }
  ): Promise<MenuModel> {
    return this._repository.findByIdAndUpdate(id, menu).exec();
  }

  public async delete(id: string): Promise<void> {
    await this._repository.findByIdAndDelete(id).exec();
  }

  public async getNextId() {
    const maxIdProduct = await this._repository.findOne().sort({ id: 'desc' });
    const maxId = maxIdProduct ? maxIdProduct.id + 1 : 1;
    return maxId;
  }
}
