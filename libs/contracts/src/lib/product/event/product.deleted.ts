import { ApiProperty } from '@nestjs/swagger';

export class ProductDeletedEventPayload {
  @ApiProperty()
  public readonly id: number;
}
