import { PaymentType } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentCreateCommandRequest {
  @ApiProperty()
  public readonly sum: number;

  @ApiProperty()
  public readonly type: PaymentType;
}

export class PaymentCreateCommandResponse {
  @ApiProperty()
  public readonly success: boolean;

  @ApiProperty()
  public readonly id: number;
}
