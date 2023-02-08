import { ApiProperty } from '@nestjs/swagger';
import { MenuItemCreateRequestDto } from '@burger-shop/interfaces';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MenuCreateCommandRequest {
  @ApiProperty({ type: MenuItemCreateRequestDto, isArray: true })
  @Type(() => MenuItemCreateRequestDto)
  @ValidateNested()
  public readonly items: MenuItemCreateRequestDto[];
}

export class MenuCreateCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
  @ApiProperty()
  public readonly id?: string;
}
