import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CookingRequestCreateCommandRequest {
  @ApiProperty()
  @IsString()
  public readonly productId: string;
}

export class CookingRequestCreateCommandResponse {
  @ApiProperty()
  @IsString()
  public readonly id: string;
}
