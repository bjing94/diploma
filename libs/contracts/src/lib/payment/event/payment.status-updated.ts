import { PaymentStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentStatusUpdatedEventPayload {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly status: PaymentStatus;

  @ApiProperty()
  public readonly orderId: string;
}
