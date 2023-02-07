import { ApiProperty } from '@nestjs/swagger';

export class PaymentGetQueryRequest {
  @ApiProperty()
  public readonly id: string;
}

export class PaymentGetQueryResponse {
  @ApiProperty()
  public readonly payment: any;
}
