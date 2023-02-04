import MenuItemDomainEntity from '../../domain/menu-item.domain-entity';
import MenuDomainEntity from '../../domain/menu.domain-entity';
import { MenuItemModel } from '../../infrastructure/database/model/menu-item.model';
import { MenuModel } from '../../infrastructure/database/model/menu.model';
import ProductDomainMapper from './product.domain.mapper';

export default class MenuDomainMapper {
  public static toDomain(menu: MenuModel): MenuDomainEntity {
    const domainItems = menu.items.map((item) => {
      return new MenuItemDomainEntity(
        ProductDomainMapper.toDomain(item.product),
        item.available,
        item.price,
        item.id
      );
    });
    return new MenuDomainEntity(domainItems, menu.id);
  }
  //   @Prop()
  //   id: number;

  //   @Prop()
  //   available: boolean;

  //   @Prop()
  //   price: number;

  //   @Prop({
  //     type: [Types.ObjectId],
  //     ref: Product.name,
  //   })
  //   product: Product;
  // public static toDatabase(menu: MenuDomainEntity): MenuModel {
  //   return new MenuModel({
  //     id: menu.id,
  //     items: menu.items.map((item) => {
  //       return new MenuItemModel({
  //         id: item.id,
  //         price: item.price,
  //         available: item.available,
  //         product: { _id: '' },
  //       });
  //     }),
  //   });
  // }
}
