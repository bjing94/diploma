import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product.response.dto';

export class MenuItemResponseDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty({ type: ProductResponseDto })
  public readonly product: ProductResponseDto;

  @ApiProperty()
  public readonly available: boolean;

  @ApiProperty()
  public readonly price: number;
}
