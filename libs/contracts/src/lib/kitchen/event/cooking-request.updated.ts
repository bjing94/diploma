import { CookingRequestStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CookingRequestUpdatedEventPayload {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty()
  @IsString()
  public readonly productId: string;

  @ApiProperty()
  @IsString()
  public readonly status: CookingRequestStatus;

  @ApiProperty()
  @IsString()
  public readonly eventName: string;
}
