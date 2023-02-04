import { MenuResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class MenuGetQueryRequest {
  @ApiProperty()
  public readonly id: number;
}

export class MenuGetQueryResponse {
  @ApiProperty({ type: MenuResponseDto })
  public readonly menu: MenuResponseDto;
}
