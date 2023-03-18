import { PaymentStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class PaymentUpdateCommandRequest {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty({ enum: PaymentStatus })
  @IsString()
  @IsEnum(PaymentStatus)
  public readonly status: PaymentStatus;
}

export class PaymentUpdateCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
}
