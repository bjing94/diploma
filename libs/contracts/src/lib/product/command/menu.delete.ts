import { ApiProperty } from '@nestjs/swagger';

export class MenuDeleteCommandRequest {
  @ApiProperty()
  public readonly id: number;
}

export class MenuDeleteCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
}
