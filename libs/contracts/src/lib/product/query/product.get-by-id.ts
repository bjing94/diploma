import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '@burger-shop/interfaces';

export class ProductGetByIdQueryRequest {
  @ApiProperty()
  public id: number;
}

export class ProductGetByIdQueryResponse {
  @ApiProperty()
  public product: ProductResponseDto;
}
