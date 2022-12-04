import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
}

export class OrderItemResponse {
  @ApiProperty()
  public readonly foodId: string;

  @ApiProperty()
  public readonly count: number;
}
