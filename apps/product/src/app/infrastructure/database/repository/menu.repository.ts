import { MenuFindQueryRequest } from '@burger-shop/contracts';
import { MenuCreatedDto, MenuCreateDto } from '@burger-shop/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import MenuAbstractRepository from '../../../application/repository/menu.abstract-repository';
import { READ_CONNECTION_NAME } from '../../../config/mongoose.config';
import { MenuDocument, MenuModel } from '../model/menu.model';

export default class MenuRepository implements MenuAbstractRepository {
  constructor(
    @InjectModel(MenuModel.name, READ_CONNECTION_NAME)
    private readonly _repository: Model<MenuDocument>
  ) {}

  public async get(id: string): Promise<MenuDocument> {
    return this._repository.findById(id).populate('items.product').exec();
  }

  public findOne(data: {
    id?: string;
    active?: boolean;
  }): Promise<MenuDocument> {
    return this._repository.findOne(data).exec();
  }

  public async findMany(dto: MenuFindQueryRequest): Promise<MenuDocument[]> {
    return this._repository.find(dto).exec();
  }

  public async create(menu: MenuCreateDto): Promise<MenuDocument> {
    const { id, ...rest } = menu;
    return this._repository.create({
      _id: new Types.ObjectId(id),
      ...rest,
    });
  }

  public async update(
    id: string,
    menu: Omit<MenuCreatedDto, 'id'>
  ): Promise<MenuDocument> {
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

  public getActiveMenu(): Promise<MenuDocument> {
    return this._repository
      .findOne({ active: true })
      .populate('items.product')
      .exec();
  }
}
