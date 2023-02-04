import { ApiProperty } from '@nestjs/swagger';
import { MenuUpdateRequestDto } from '@burger-shop/interfaces';

export class MenuUpdateCommandRequest {
  @ApiProperty({ type: MenuUpdateRequestDto })
  public readonly menu: MenuUpdateRequestDto;
}

export class MenuUpdateCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
}
