import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductFindQueryRequest {
  @ApiProperty({ name: 'pagination[take]' })
  @IsString()
  public readonly take: number;

  @ApiProperty({ name: 'pagination[skip]' })
  @IsString()
  public readonly skip: number;
}

export class ProductFindQueryResponse {
  @ApiProperty()
  public readonly products: ProductResponseDto[];
}
