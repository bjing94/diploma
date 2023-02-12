import { ApiProperty } from '@nestjs/swagger';
import { MenuItemResponseDto } from '@burger-shop/interfaces';
import { IsString } from 'class-validator';

export class ProductGetMenuItemQueryRequest {
  @ApiProperty()
  @IsString()
  public id: string;
}

export class ProductGetMenuItemQueryResponse {
  @ApiProperty()
  public product: MenuItemResponseDto;
}
