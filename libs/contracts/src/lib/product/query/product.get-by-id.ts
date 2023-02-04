import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '@burger-shop/interfaces';
import { IsNumber } from 'class-validator';

export class ProductGetByIdQueryRequest {
  @ApiProperty()
  @IsNumber()
  public id: number;
}

export class ProductGetByIdQueryResponse {
  @ApiProperty()
  public product: ProductResponseDto;
}
