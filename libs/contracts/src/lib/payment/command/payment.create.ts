import { PaymentType } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PaymentCreateCommandRequest {
  @ApiProperty()
  @IsNumber()
  public readonly sum: number;

  @ApiProperty({ enum: PaymentType })
  @IsString()
  public readonly type: PaymentType;
}

export class PaymentCreateCommandResponse {
  @ApiProperty()
  public readonly id: string;
}
