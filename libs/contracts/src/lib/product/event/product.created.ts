import { ApiProperty } from '@nestjs/swagger';

export class ProductCreatedEventPayload {
  @ApiProperty()
  public readonly product: { name: string; id: string };
}
