import { ApiProperty } from '@nestjs/swagger';

export default class ProductUpdatedDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;
}
