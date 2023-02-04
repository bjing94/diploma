import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class ProductUpdateRequest {
  @ApiProperty()
  public readonly id: number;
  @ApiProperty()
  public readonly price: number;
  @ApiProperty()
  public readonly name: string;
}
export class ProductUpdateResponse {
  @ApiProperty()
  public readonly product: ProductResponseDto;
}
