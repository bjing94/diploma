import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuResponseDto } from '@burger-shop/interfaces';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MenuFindQueryRequest {
  @ApiPropertyOptional({ name: 'filter[id]' })
  @IsOptional()
  @IsString()
  public id?: string;

  @ApiPropertyOptional({ name: 'filter[active]' })
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}

export class MenuFindQueryResponse {
  @ApiProperty({ type: MenuResponseDto, isArray: true })
  public readonly menus: MenuResponseDto[];
}
