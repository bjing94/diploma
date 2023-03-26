import {
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeleteResponse,
  ProductFindQueryRequest,
  ProductFindQueryResponse,
  ProductGetByIdQueryResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from '@burger-shop/contracts';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, OmitType } from '@nestjs/swagger';
import ProductService from './product.service';

@ApiTags('Product')
@Controller('product')
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ description: 'Create product' })
  @Post()
  public async create(
    @Body() dto: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    return this.productService.create(dto);
  }

  @ApiOperation({ description: 'Find products' })
  @Get()
  public async find(
    @Query('filter') dto: ProductFindQueryRequest
  ): Promise<ProductFindQueryResponse> {
    console.log(dto);
    return this.productService.find(dto);
  }

  @ApiOperation({ description: 'Get product' })
  @Get(':id')
  public async get(
    @Param('id') id: string
  ): Promise<ProductGetByIdQueryResponse> {
    return this.productService.get(id);
  }

  @ApiOperation({ description: 'Update product' })
  @ApiBody({ type: OmitType(ProductUpdateRequest, ['id']) })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: Omit<ProductUpdateRequest, 'id'>
  ): Promise<ProductUpdateResponse> {
    return this.productService.update({ ...dto, id });
  }

  @ApiOperation({ description: 'Delete product' })
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<ProductDeleteResponse> {
    return this.productService.delete({ id });
  }
}
