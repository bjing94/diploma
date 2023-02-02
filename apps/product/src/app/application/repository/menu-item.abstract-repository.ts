import { MenuItemModel } from '../../infrastructure/database/model/menu-item.model';

export default abstract class MenuItemAbstractRepository {
  public abstract find(id: number): Promise<MenuItemModel>;
  public abstract findMany(
    take: number,
    skip: number
  ): Promise<MenuItemModel[]>;
  public abstract create(order: MenuItemModel): Promise<MenuItemModel>;
  public abstract update(
    id: number,
    order: MenuItemModel
  ): Promise<MenuItemModel>;
  public abstract delete(id: number): Promise<void>;
}
