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

  @ApiOperation({ description: 'Create menu' })
  @Post()
  public async create(@Body() dto: MenuCreateCommandRequest): Promise<any> {
    return this.menuService.create(dto);
  }

  @ApiOperation({ description: 'Get menus' })
  @Get()
  public async find(
    @Query('filter') filters: MenuFindQueryRequest = {}
  ): Promise<MenuFindQueryResponse> {
    return this.menuService.findMenu(filters);
  }

  @ApiOperation({ description: 'Get active menu' })
  @Get('active')
  public async getActive(): Promise<MenuGetQueryResponse> {
    const menus = await this.menuService.findMenu({ active: true });
    return { menu: menus.menus[0] };
  }

  @ApiOperation({ description: 'Run menu events' })
  @Get('run-events')
  public async runMenuEvents(): Promise<void> {
    return this.menuService.runMenuEvents();
  }

  @ApiOperation({ description: 'Get item from menu' })
  @Get('item/:id')
  public async getItem(
    @Param('id') id: string
  ): Promise<ProductGetMenuItemQueryResponse> {
    return this.menuService.getMenuItem({ id });
  }

  @ApiOperation({ description: 'Get menu' })
  @Get(':id')
  public async get(@Param('id') id: string): Promise<MenuGetQueryResponse> {
    return this.menuService.getMenu({ id });
  }

  @ApiOperation({ description: 'Update menu' })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: MenuUpdateRequestDto
  ): Promise<MenuUpdateCommandResponse> {
    return this.menuService.updateMenu({ data: dto, id });
  }
}
