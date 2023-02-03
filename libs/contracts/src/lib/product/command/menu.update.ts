import { ApiProperty } from '@nestjs/swagger';
import { MenuUpdateRequestDto } from '@burger-shop/interfaces';

export namespace MenuUpdate {
  export const topic = 'menu.update.command';

  export class Request {
    @ApiProperty({ type: MenuUpdateRequestDto })
    public readonly menu: MenuUpdateRequestDto;
  }

  export class Response {
    @ApiProperty()
    public readonly success: boolean;
  }
}
