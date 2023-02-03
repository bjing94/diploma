import { MenuCreatedDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace MenuCreated {
  export const topic = 'menu.created.event';

  export class Payload {
    @ApiProperty({ type: MenuCreatedDto })
    public readonly menu: MenuCreatedDto;
  }
}
