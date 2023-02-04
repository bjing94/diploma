import { ApiProperty } from '@nestjs/swagger';
import { MenuItemCreateRequestDto } from '@burger-shop/interfaces';

export class MenuCreateCommandRequest {
  @ApiProperty()
  public readonly items: MenuItemCreateRequestDto[];
}

export class MenuCreateCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
}
