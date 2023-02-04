// import { MenuCreate } from '@burger-shop/contracts';
// import { Body, Controller, Post } from '@nestjs/common';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import MenuService from './menu.service';

// @ApiTags('Menu')
// @Controller('menu')
// export default class MenuController {
//   constructor(private readonly menuService: MenuService) {}

//   @ApiOperation({ description: 'Create product' })
//   @Post()
//   public async create(@Body() dto: MenuCreate.Request): Promise<any> {
//     return this.menuService.create(dto);
//   }

//   // @ApiOperation({ description: 'Create product' })
//   // @Post()
//   // public async create(@Body() dto: ProductCreate.Request): Promise<any> {
//   //   return this.productService.create(dto);
//   // }
// }
