import { MenuResponseDto } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace MenuGet {
  export const topic = 'menu.get.query';

  export class Request {
    @ApiProperty()
    public readonly id: number;
  }

  export class Response {
    @ApiProperty({ type: MenuResponseDto })
    public readonly menu: MenuResponseDto;
  }
}
