import { ApiProperty } from '@nestjs/swagger';

export class ProductDeleteRequest {
  @ApiProperty()
  public readonly id: number;
}
export class ProductDeleteResponse {
  @ApiProperty()
  public readonly success: boolean;
}
