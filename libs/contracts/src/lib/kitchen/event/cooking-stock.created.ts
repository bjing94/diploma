import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CookingStockCreatedEventPayload {
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
