import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class ProductFindQueryRequest {
  @ApiProperty()
  public readonly take: number;
  @ApiProperty()
  public readonly skip: number;
}

export class ProductFindQueryResponse {
  @ApiProperty()
  public readonly products: ProductResponseDto[];
}
