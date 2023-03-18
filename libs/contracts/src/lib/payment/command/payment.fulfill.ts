import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentFulfillCommandRequest {
  @ApiProperty()
  @IsString()
  public readonly id: string;
}

export class PaymentFulfillCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
}
