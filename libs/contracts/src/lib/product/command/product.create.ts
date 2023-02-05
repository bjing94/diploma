import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductCreateRequest {
  @ApiProperty()
  @IsNumber()
  public readonly price: number;
  @ApiProperty()
  @IsString()
  public readonly name: string;
}
export class ProductCreateResponse {
  @ApiProperty()
  public readonly succes: boolean;
}
