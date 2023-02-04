import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderCompleteCommandRequest {
  @ApiProperty()
  @IsString()
  public orderId: string;
}

export class OrderCompleteCommandResponse {
  @ApiProperty()
  public readonly result: boolean;
}
