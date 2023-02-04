import { ProductResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCreatedEventPayload {
  @ApiProperty()
  public readonly product: ProductResponseDto;
}
