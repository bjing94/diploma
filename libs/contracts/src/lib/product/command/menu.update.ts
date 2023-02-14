import { ApiProperty } from '@nestjs/swagger';
import { MenuUpdateRequestDto } from '@burger-shop/interfaces';
import { IsString } from 'class-validator';

export class MenuUpdateCommandRequest {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty({ type: MenuUpdateRequestDto })
  public readonly data: MenuUpdateRequestDto;
}

export class MenuUpdateCommandResponse {
  @ApiProperty()
  public readonly success: boolean;
}
