import { ApiProperty } from '@nestjs/swagger';
import { MenuItemCreateRequestDto } from '@burger-shop/interfaces';

export namespace MenuCreate {
  export const topic = 'menu.create.command';

  export class Request {
    @ApiProperty()
    public readonly items: MenuItemCreateRequestDto[];
  }

  export class Response {
    @ApiProperty()
    public readonly success: boolean;
  }
}
