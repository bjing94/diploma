import { ApiProperty } from '@nestjs/swagger';

export class OrderCreatedEventPayload {
  @ApiProperty()
  public readonly order: any;
}
