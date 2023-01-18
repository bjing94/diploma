import { ApiProperty } from '@nestjs/swagger';

export namespace ProductDeleted {
  export const topic = 'product.deleted.event';

  export class Payload {
    @ApiProperty()
    public readonly id: number;
  }
}
