import { ApiProperty } from '@nestjs/swagger';

export class MenuItemCreateRequestDto {
  @ApiProperty()
  public readonly productId: number;

  @ApiProperty()
  public readonly available: boolean;

  @ApiProperty()
  public readonly price: number;
}
