import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace ProductCreated {
  export const topic = 'product.created.event';

  export class Payload {
    @ApiProperty()
    public readonly product: ProductResponseDto;
  }
}
