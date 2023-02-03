import { ApiProperty } from '@nestjs/swagger';
import { MenuItemCreatedDto } from './menu-item.created.dto';

export class MenuCreatedDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly items: MenuItemCreatedDto[];
}
