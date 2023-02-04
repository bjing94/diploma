import { ApiProperty } from '@nestjs/swagger';

export class MenuItemUpdateRequestDto {
  @ApiProperty()
  public readonly productId: number;

  @ApiProperty()
  public readonly available: boolean;

  @ApiProperty()
  public readonly price: number;
}
