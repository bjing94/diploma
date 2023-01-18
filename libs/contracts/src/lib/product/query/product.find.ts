import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace ProductFind {
  export const topic = 'product.find.query';

  export class Request {
    @ApiProperty()
    public readonly take: number;
    @ApiProperty()
    public readonly skip: number;
  }

  export class Response {
    @ApiProperty()
    public readonly products: ProductResponseDto[];
  }
}
