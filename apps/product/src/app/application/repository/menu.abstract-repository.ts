import { MenuModel } from '../../infrastructure/database/model/menu.model';

export default abstract class MenuAbstractRepository {
  public abstract find(id: number): Promise<MenuModel>;
  public abstract findMany(take: number, skip: number): Promise<MenuModel[]>;
  public abstract create(order: MenuModel): Promise<MenuModel>;
  public abstract update(id: number, order: MenuModel): Promise<MenuModel>;
  public abstract delete(id: number): Promise<void>;
}
