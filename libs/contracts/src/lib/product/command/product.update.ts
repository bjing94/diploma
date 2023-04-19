import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductUpdateRequest {
  @ApiProperty()
  @IsNumber()
  public readonly id: string;

  @ApiProperty()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly imgLink?: string;
}
export class ProductUpdateResponse {
  @ApiProperty()
  public readonly success: boolean;
}
