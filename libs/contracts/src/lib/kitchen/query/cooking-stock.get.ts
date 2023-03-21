import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CookingStockGetQueryRequest {
  @ApiProperty()
  @IsString()
  public readonly id: string;
}

export class CookingStockGetQueryResponse {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty()
  @IsString()
  public readonly productId: string;

  @ApiProperty()
  @IsNumber()
  public readonly quantity: number;
}
