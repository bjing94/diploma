import { PaymentStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentStatusUpdatedEventPayload {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly status: PaymentStatus;
}
