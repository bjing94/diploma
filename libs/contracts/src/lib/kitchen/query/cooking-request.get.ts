import {
  CookingRequestStatus,
  ProductResponseDto,
} from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CookingRequestGetQueryRequest {
  @ApiProperty()
  @IsString()
  public readonly id: string;
}

export class CookingRequestGetQueryResponse {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty({ type: ProductResponseDto })
  @IsString()
  public readonly product: ProductResponseDto;

  @ApiProperty()
  @IsString()
  public readonly status: CookingRequestStatus;
}
