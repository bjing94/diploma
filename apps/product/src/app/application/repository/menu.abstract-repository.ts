import { MenuFindQueryRequest } from '@burger-shop/contracts';
import {
  MenuCreatedDto,
  MenuCreateDto,
  MenuUpdatedDto,
} from '@burger-shop/interfaces';
import { MenuDocument } from '../../infrastructure/database/model/menu.model';

export default abstract class MenuAbstractRepository {
  public abstract get(id: string): Promise<MenuDocument>;
  public abstract findOne(data: {
    id?: string;
    active?: boolean;
  }): Promise<MenuDocument>;
  public abstract findMany(dto: MenuFindQueryRequest): Promise<MenuDocument[]>;
  public abstract create(menu: MenuCreateDto): Promise<MenuDocument>;
  public abstract update(
    id: string,
    menu: Omit<MenuUpdatedDto, 'id'>
  ): Promise<MenuDocument>;
  public abstract delete(id: string): Promise<void>;
  public abstract getActiveMenu(): Promise<MenuDocument>;
  public abstract clearAll(): Promise<void>;
}
