import { ProductCreate } from '@burger-shop/contracts';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import ProductService from './product.service';

@ApiTags('Product')
@Controller('product')
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @ApiOperation({ description: 'Create product' })
  // @Post()
  // public async create(@Body() dto: ProductCreate.Request): Promise<any> {
  //   return this.productService.create(dto);
  // }
}
