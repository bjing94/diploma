import {
  DeliveryInfoResponse,
  OrderStatus,
  PaymentInfoResponse,
} from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

class OrderItem {
  @IsString()
  @ApiProperty()
  public readonly foodId: string;

  @IsNumber()
  @ApiProperty()
  public readonly count: number;
}

export class OrderGetQueryRequest {
  @IsString()
  @ApiProperty()
  public readonly id: string;
}

export class OrderGetQueryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: OrderStatus;

  // @ApiProperty({ isArray: true })
  // orderItems: OrderItem[];

  // @ApiProperty()
  // paymentInfo: PaymentInfoResponse;

  // @ApiProperty()
  // createdAt: Date;
}
