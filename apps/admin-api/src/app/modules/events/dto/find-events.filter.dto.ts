import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString } from 'class-validator';

export default class FindEventsFilterDto {
  @ApiProperty({
    name: 'filter[from]',
  })
  @IsDateString()
  public readonly from: Date;

  @ApiProperty({
    name: 'filter[to]',
  })
  @IsDateString()
  public readonly to: Date;
}
