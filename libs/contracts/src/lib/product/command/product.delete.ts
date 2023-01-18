import { ApiProperty } from '@nestjs/swagger';

export namespace ProductDelete {
  export const topic = 'product.delete.command';

  export class Request {
    @ApiProperty()
    public readonly id: number;
  }

  export class Response {
    @ApiProperty()
    public readonly success: boolean;
  }
}
