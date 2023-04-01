import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductFindQueryRequest {
  @ApiProperty({ name: 'filter[ids]' })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  public readonly ids?: string[];

  @ApiProperty({ name: 'filter[take]', example: 5 })
  @IsString()
  public readonly take: number;

  @ApiProperty({ name: 'filter[skip]', example: 0 })
  @IsString()
  public readonly skip: number;
}

export class ProductFindQueryResponse {
  @ApiProperty()
  public readonly products: ProductResponseDto[];
}
