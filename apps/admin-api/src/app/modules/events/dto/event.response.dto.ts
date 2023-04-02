import { ApiProperty } from '@nestjs/swagger';

export default class EventResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  objectId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  payload: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
