import {
  DeliveryInfoResponse,
  OrderStatus,
  PaymentInfoResponse,
} from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsArray } from 'class-validator';

class OrderFindSingle {
  @ApiProperty()
  id: string;
  @ApiProperty()
  status: OrderStatus;
}

export class OrderFindQueryRequest {
  @IsEnum(OrderStatus)
  @ApiProperty({
    name: 'filter[status]',
    enum: OrderStatus,
  })
  public readonly status: OrderStatus;
}

export class OrderFindQueryResponse {
  @ApiProperty({ type: OrderFindSingle, isArray: true })
  orders: OrderFindSingle[];
}
