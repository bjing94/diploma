import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  public readonly id?: string;

  @ApiProperty()
  public readonly name: string;
}
