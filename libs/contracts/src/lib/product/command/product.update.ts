import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductUpdateRequest {
  @ApiProperty()
  @IsNumber()
  public readonly id: string;

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
