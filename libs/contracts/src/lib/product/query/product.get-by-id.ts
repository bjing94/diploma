import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '@burger-shop/interfaces';

export namespace ProductGetById {
  export const topic = 'product.get-by-id.query';

  export class Request {
    @ApiProperty()
    public id: number;
  }
  export class Response {
    public product: ProductResponseDto;
  }
}
