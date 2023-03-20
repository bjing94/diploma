import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CookingStockAddCommandRequest {
  @ApiProperty()
  @IsString()
  public readonly productId: string;

  @ApiProperty()
  @IsNumber()
  public readonly value: number;
}

export class CookingStockAddCommandResponse {
  @ApiProperty()
  @IsString()
  public readonly productId: string;

  @ApiProperty()
  @IsNumber()
  public readonly value: number;
}
