import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export namespace ProductCreate {
  export const topic = 'product.create.command';
  export class Request {
    @ApiProperty()
    @IsNumber()
    public readonly price: number;
    @ApiProperty()
    @IsString()
    public readonly name: string;
  }

  export class Response {
    @ApiProperty()
    public readonly product: ProductResponseDto;
  }
}
