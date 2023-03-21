import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CookingStockUpdatedEventPayload {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty()
  @IsNumber()
  public readonly quantity: number;
}
