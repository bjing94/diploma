import { ApiProperty } from '@nestjs/swagger';
import ProductUpdatedDto from '../product.updated.dto';

export class ProductUpdatedEventPayload {
  @ApiProperty()
  public readonly product: ProductUpdatedDto;
  @ApiProperty()
  public readonly eventName: string;
}
