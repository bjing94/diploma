import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  NEW = 'new',
  CREATED = 'created',
  PAYED = 'payed',
  COMPLETED = 'completed',
  WAITING_FOR_PICKUP = 'waiting_for_pickup',
}

export class OrderItemResponse {
  @ApiProperty()
  public readonly foodId: string;

  @ApiProperty()
  public readonly count: number;
}
