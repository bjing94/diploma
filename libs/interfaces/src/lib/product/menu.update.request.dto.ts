import { ApiProperty } from '@nestjs/swagger';
import { MenuItemUpdateRequestDto } from './menu-item.update.request.dto';

export class MenuUpdateRequestDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty({ type: MenuItemUpdateRequestDto, isArray: true })
  public readonly items: MenuItemUpdateRequestDto[];
}
