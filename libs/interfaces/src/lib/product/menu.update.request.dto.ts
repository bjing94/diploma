import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MenuItemUpdateRequestDto } from './menu-item.update.request.dto';

export class MenuUpdateRequestDto {
  @ApiProperty({ type: MenuItemUpdateRequestDto, isArray: true })
  @Type(() => MenuItemUpdateRequestDto)
  @ValidateNested()
  public readonly items: MenuItemUpdateRequestDto[];

  @ApiProperty()
  @IsBoolean()
  public readonly active: boolean;
}
