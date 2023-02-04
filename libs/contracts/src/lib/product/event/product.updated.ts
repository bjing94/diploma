import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class ProductUpdatedEventPayload {
  @ApiProperty()
  public readonly product: ProductResponseDto;
}
