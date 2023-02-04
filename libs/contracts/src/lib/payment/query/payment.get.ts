import { ApiProperty } from '@nestjs/swagger';

export class PaymentGetQueryRequest {
  @ApiProperty()
  public readonly id: number;
}

export class PaymentGetQueryResponse {
  @ApiProperty()
  public readonly payment: any;
}
