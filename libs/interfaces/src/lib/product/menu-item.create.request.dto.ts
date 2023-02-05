import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class MenuItemCreateRequestDto {
  @ApiProperty()
  @IsNumber()
  public readonly productId: number;

  @ApiProperty()
  @IsBoolean()
  public readonly available: boolean;

  @ApiProperty()
  @IsNumber()
  public readonly price: number;
}
