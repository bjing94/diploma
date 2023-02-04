import { MenuCreatedDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class MenuCreatedEventPayload {
  @ApiProperty({ type: MenuCreatedDto })
  public readonly menu: MenuCreatedDto;
}
