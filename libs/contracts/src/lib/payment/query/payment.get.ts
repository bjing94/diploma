import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

class PaymentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  link?: string;

  @ApiProperty()
  status: PaymentStatus;

  @ApiProperty()
  sum: number;

  @ApiProperty()
  type: PaymentType;
}
export class PaymentGetQueryRequest {
  @ApiProperty()
  public readonly id: string;
}

export class PaymentGetQueryResponse {
  @ApiProperty({ type: PaymentResponse })
  public readonly payment: PaymentResponse;
}
