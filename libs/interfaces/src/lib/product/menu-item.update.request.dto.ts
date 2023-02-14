import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class MenuItemUpdateRequestDto {
  @ApiProperty()
  @IsString()
  public readonly productId: string;

  @ApiProperty()
  @IsBoolean()
  public readonly available: boolean;

  @ApiProperty()
  @IsNumber()
  public readonly price: number;
}
