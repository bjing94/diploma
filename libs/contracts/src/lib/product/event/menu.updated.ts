import { MenuCreatedDto, MenuUpdatedDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class MenuUpdatedEventPayload {
  @ApiProperty({ type: MenuCreatedDto })
  public readonly menu: MenuUpdatedDto;

  @ApiProperty()
  public readonly eventName: string;
}
