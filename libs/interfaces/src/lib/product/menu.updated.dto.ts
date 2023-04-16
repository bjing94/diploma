import { ApiProperty } from '@nestjs/swagger';
import { MenuItemCreatedDto } from './menu-item.created.dto';

export class MenuUpdatedDto {
  @ApiProperty()
  public readonly items?: MenuItemCreatedDto[];

  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly active?: boolean;
}
