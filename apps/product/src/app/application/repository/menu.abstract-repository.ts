import { MenuCreateDto } from '@burger-shop/interfaces';
import {
  MenuDocument,
  MenuModel,
} from '../../infrastructure/database/model/menu.model';

export default abstract class MenuAbstractRepository {
  public abstract find(id: string): Promise<MenuDocument>;
  public abstract findMany(take: number, skip: number): Promise<MenuDocument[]>;
  public abstract create(menu: MenuCreateDto): Promise<MenuDocument>;
  public abstract update(id: string, menu: any): Promise<MenuDocument>;
  public abstract delete(id: string): Promise<void>;
  public abstract getNextId(): Promise<number>;
  public abstract getActiveMenu(): Promise<MenuDocument>;
}
