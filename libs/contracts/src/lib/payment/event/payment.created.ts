import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

interface PaymentCreatedDto {
  id: string;
  orderId: string;
  link?: string;
  status: PaymentStatus;
  sum: number;
  type: PaymentType;
}

export class PaymentCreatedEventPayload {
  @ApiProperty()
  public readonly payment: PaymentCreatedDto;
}
