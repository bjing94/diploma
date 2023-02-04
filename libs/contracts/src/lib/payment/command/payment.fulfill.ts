import { ApiProperty } from '@nestjs/swagger';

export class PaymentFulfillCommandRequest {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly hash: string;
}

export class PaymentFulfillCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
}
