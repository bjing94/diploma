import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '@burger-shop/interfaces';
import { IsString } from 'class-validator';

export class ProductGetByIdQueryRequest {
  @ApiProperty()
  @IsString()
  public id: string;
}

export class ProductGetByIdQueryResponse {
  @ApiProperty()
  public product: ProductResponseDto;
}
