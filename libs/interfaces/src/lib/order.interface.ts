import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  CREATED = 'created',
  PAYED = 'payed',
  WAITING_FOR_PAYMENT = 'waiting_for_payment',
  COMPLETED = 'completed',
}

export class OrderItemResponse {
  @ApiProperty()
  public readonly foodId: string;

  @ApiProperty()
  public readonly count: number;
}
