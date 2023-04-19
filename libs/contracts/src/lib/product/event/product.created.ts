import { ApiProperty } from '@nestjs/swagger';

export class ProductCreatedEventPayload {
  @ApiProperty()
  public readonly product: { name: string; id: string; imgLink?: string };

  @ApiProperty()
  public readonly eventName: string;
}
