import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class MenuItemCreateRequestDto {
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
