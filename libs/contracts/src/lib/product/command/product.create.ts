import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace ProductCreate {
  export const topic = 'product.create.command';
  export class Request {
    @ApiProperty()
    public readonly price: number;
    @ApiProperty()
    public readonly name: string;
  }

  export class Response {
    @ApiProperty()
    public readonly product: ProductResponseDto;
  }
}
