import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace ProductUpdate {
  export const topic = 'product.update.command';
  export class Request {
    @ApiProperty()
    public readonly id: number;
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
