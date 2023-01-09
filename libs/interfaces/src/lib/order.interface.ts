import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  CREATED = 'created',
  PAYED = 'payed',
  COMPLETED = 'completed',
}

export class OrderItemResponse {
  @ApiProperty()
  public readonly foodId: string;

  @ApiProperty()
  public readonly count: number;
}
