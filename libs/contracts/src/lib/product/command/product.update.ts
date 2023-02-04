import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductUpdateRequest {
  @ApiProperty()
  @IsNumber()
  public readonly id: number;

  @ApiProperty()
  @IsNumber()
  public readonly price: number;

  @ApiProperty()
  @IsString()
  public readonly name: string;
}
export class ProductUpdateResponse {
  @ApiProperty()
  public readonly success: boolean;
}
