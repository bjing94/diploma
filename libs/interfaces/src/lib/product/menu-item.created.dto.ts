import { ApiProperty } from '@nestjs/swagger';

export class MenuItemCreatedDto {
  @ApiProperty()
  public readonly product: { _id: string };

  @ApiProperty()
  public readonly available: boolean;

  @ApiProperty()
  public readonly price: number;
}
