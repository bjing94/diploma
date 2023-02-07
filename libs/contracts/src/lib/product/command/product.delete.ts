import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ProductDeleteRequest {
  @ApiProperty()
  @IsNumber()
  public readonly id: string;
}
export class ProductDeleteResponse {
  @ApiProperty()
  public readonly success: boolean;
}
