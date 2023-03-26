import { CookingRequestStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CookingRequestGetQueryResponse } from './cooking-request.get';

export class CookingRequestFindQueryRequest {
  @IsEnum(CookingRequestStatus)
  @ApiProperty({
    name: 'filter[status]',
    enum: CookingRequestStatus,
  })
  public readonly status: CookingRequestStatus;
}

export class CookingRequestFindQueryResponse {
  @ApiProperty({ type: CookingRequestGetQueryResponse, isArray: true })
  public readonly requests: CookingRequestGetQueryResponse[];
}
