import { ApiProperty } from '@nestjs/swagger';

export namespace MenuDelete {
  export const topic = 'menu.delete.command';

  export class Request {
    @ApiProperty()
    public readonly id: number;
  }

  export class Response {
    @ApiProperty()
    public readonly success: boolean;
  }
}
