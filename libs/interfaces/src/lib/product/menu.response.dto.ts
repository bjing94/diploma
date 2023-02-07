import { ApiProperty } from '@nestjs/swagger';
import { MenuItemResponseDto } from './menu-item.response.dto';

export class MenuResponseDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty({ type: MenuItemResponseDto, isArray: true })
  public readonly items: MenuItemResponseDto[];
}