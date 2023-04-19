import { ApiProperty } from '@nestjs/swagger';

export class ProductDeletedEventPayload {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly eventName: string;
}
