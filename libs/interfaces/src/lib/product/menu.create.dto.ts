class MenuItemCreateDto {
  public readonly id: number;
  public readonly productId: string;
  public readonly price: number;
  public readonly available: boolean;
}
export class MenuCreateDto {
  public readonly id: string;

  public readonly items: MenuItemCreateDto[];

  public readonly active: boolean;
}
