import { MenuResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MenuGetQueryRequest {
  @ApiProperty()
  @IsNumber()
  public readonly id: number;
}

export class MenuGetQueryResponse {
  @ApiProperty({ type: MenuResponseDto })
  public readonly menu: MenuResponseDto;
}
