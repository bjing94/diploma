import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  CREATED = 'created',
  PAYED = 'payed',
  WAITING_FOR_PAYMENT = 'waiting_for_payment',
  COMPLETED = 'completed',
  WAITING_FOR_PICKUP = 'waiting_for_pickup',
}

export class OrderItemResponse {
  @ApiProperty()
  public readonly foodId: string;

  @ApiProperty()
  public readonly count: number;
}
