import {
  MenuCreateCommandRequest,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
} from '@burger-shop/contracts';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import MenuService from './menu.service';

@ApiTags('Menu')
@Controller('menu')
export default class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ description: 'Create menu' })
  @Post()
  public async create(@Body() dto: MenuCreateCommandRequest): Promise<any> {
    return this.menuService.create(dto);
  }

  @ApiOperation({ description: 'Get menu' })
  @Get(':id')
  public async get(@Param('id') id: string): Promise<MenuGetQueryResponse> {
    return this.menuService.getMenu({ id });
  }
}
