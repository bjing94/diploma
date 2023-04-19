import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductCreateRequest {
  @ApiProperty()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly imgLink?: string;
}
export class ProductCreateResponse {
  @ApiProperty()
  public readonly succes: boolean;
}
