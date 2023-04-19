import { CookingRequestStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CookingRequestCreatedEventPayload {
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
  public readonly eventName: string;
}
