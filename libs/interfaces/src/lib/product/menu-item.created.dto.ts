import { ApiProperty } from '@nestjs/swagger';

export class MenuItemCreatedDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly productId: string;

  @ApiProperty()
  public readonly available: boolean;

  @ApiProperty()
  public readonly price: number;
}
