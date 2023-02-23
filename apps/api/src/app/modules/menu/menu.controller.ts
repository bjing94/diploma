import {
  MenuCreateCommandRequest,
  MenuFindQueryRequest,
  MenuFindQueryResponse,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
  MenuUpdateCommandRequest,
  MenuUpdateCommandResponse,
  ProductGetMenuItemQueryRequest,
  ProductGetMenuItemQueryResponse,
} from '@burger-shop/contracts';
import { MenuUpdateRequestDto } from '@burger-shop/interfaces';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Param, Put, Query } from '@nestjs/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import MenuService from './menu.service';

@ApiTags('Menu')
@Controller('menu')
export default class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ description: 'Get active menu' })
  @Get('active')
  public async getActive(): Promise<MenuFindQueryResponse> {
    return this.menuService.findMenu({ active: true });
  }

  @ApiOperation({ description: 'Get item from menu' })
  @Get('item/:id')
  public async getItem(
    @Param('id') id: string
  ): Promise<ProductGetMenuItemQueryResponse> {
    return this.menuService.getMenuItem({ id });
  }
}
