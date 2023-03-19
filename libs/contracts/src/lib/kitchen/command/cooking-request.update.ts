import { CookingRequestStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CookingRequestUpdateCommandRequest {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty()
  @IsEnum(CookingRequestStatus)
  public readonly status: CookingRequestStatus;
}

export class CookingRequestUpdateCommandResponse {
  @ApiProperty()
  @IsString()
  public readonly id: string;
}
