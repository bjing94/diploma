import { PaymentType } from '@burger-shop/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PaymentInfo {
  @ApiProperty({ enum: PaymentType })
  @IsString()
  @IsEnum(PaymentType)
  public readonly type: PaymentType;
}

// class DeliveryInfo {
//   @ApiProperty()
//   @IsString()
//   public readonly tableId: string;
// }

class OrderItem {
  @IsString()
  @ApiProperty()
  public readonly productId: string;

  @IsNumber()
  @ApiProperty()
  public readonly count: number;
}

export class OrderCreateCommandRequest {
  @IsArray()
  @ValidateNested()
  @Type(() => OrderItem)
  @ApiProperty({ type: OrderItem, isArray: true })
  public readonly orderItems: OrderItem[];

  // @ValidateNested()
  // @Type(() => DeliveryInfo)
  // @IsOptional()
  // @ApiPropertyOptional({ type: DeliveryInfo })
  // public readonly deliveryInfo?: DeliveryInfo;

  @ValidateNested()
  @Type(() => PaymentInfo)
  @ApiProperty({ type: PaymentInfo })
  public readonly paymentInfo: PaymentInfo;
}

export class OrderCreateCommandResponse {
  @ApiProperty()
  public readonly orderId: string;
}
