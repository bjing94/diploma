import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export namespace OrderCreate {
  export class OrderItem {
    @IsString()
    @ApiProperty()
    public readonly foodId: string;

    @IsNumber()
    @ApiProperty()
    public readonly count: number;
  }
  export class OrderResponse {
    @ApiProperty()
    public readonly orderId: string;
  }

  export const topic = 'order.create.command';

  export class Request {
    @IsArray()
    @ValidateNested()
    @Type(() => OrderItem)
    @ApiProperty({ type: OrderItem, isArray: true })
    orderItems: OrderItem[];
  }

  export class Response {
    @ApiProperty()
    public readonly orderId: string;
  }
}
