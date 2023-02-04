import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderPayCommandRequest {
  @ApiProperty()
  @IsString()
  public orderId: string;
}

export class OrderPayCommandResponse {
  @ApiProperty()
  public readonly orderId: string;
}
