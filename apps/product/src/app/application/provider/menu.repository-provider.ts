import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import MenuAbstractRepository from '../repository/menu.abstract-repository';
import {
  MenuDocument,
  MenuModel,
} from '../../infrastructure/database/model/menu.model';
import MenuRepository from '../../infrastructure/database/repository/menu.repository';

@Injectable()
export default class MenuRepositoryProvider {
  public repository: MenuAbstractRepository;

  constructor(
    @InjectModel(MenuModel.name)
    private readonly productModel: Model<MenuDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new MenuRepository(this.productModel);
  }
}
