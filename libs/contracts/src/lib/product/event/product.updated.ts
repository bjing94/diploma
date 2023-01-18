import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace ProductUpdated {
  export const topic = 'product.updated.event';

  export class Payload {
    @ApiProperty()
    public readonly product: ProductResponseDto;
  }
}
