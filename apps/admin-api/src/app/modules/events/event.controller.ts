import { Controller, Get, Query } from '@nestjs/common';
import FindEventsFilterDto from './dto/find-events.filter.dto';
import EventService from './event.service';
import EventMapper from './event.mapper';

@Controller('event')
export default class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('order')
  public async getOrderEvents(@Query('filter') filter: FindEventsFilterDto) {
    const events = await this.eventService.getOrderEvents(filter);
    return EventMapper.toResponseMany(events);
  }

  @Get('product')
  public async getProductEvents(@Query('filter') filter: FindEventsFilterDto) {
    const events = await this.eventService.getProductEvents(filter);
    return EventMapper.toResponseMany(events);
  }

  @Get('cooking-request')
  public async getCookingRequestEvents(
    @Query('filter') filter: FindEventsFilterDto
  ) {
    const events = await this.eventService.getCookingRequestEvents(filter);
    return EventMapper.toResponseMany(events);
  }

  @Get('cooking-stock')
  public async getCookingStockEvents(
    @Query('filter') filter: FindEventsFilterDto
  ) {
    const events = await this.eventService.getCookingStockEvents(filter);
    return EventMapper.toResponseMany(events);
  }

  @Get('payment')
  public async getPaymentEvents(@Query('filter') filter: FindEventsFilterDto) {
    const events = await this.eventService.getPaymentEvents(filter);
    return EventMapper.toResponseMany(events);
  }

  @Get('menu')
  public async getMenuEvents(@Query('filter') filter: FindEventsFilterDto) {
    const events = await this.eventService.getMenuEvents(filter);
    return EventMapper.toResponseMany(events);
  }

  @Get('menu/run-events')
  public async runMenuEvents() {
    await this.eventService.runMenuEvents();
  }

  @Get('order/run-events')
  public async runOrderEvents() {
    await this.eventService.runOrderEvents();
  }

  @Get('product/run-events')
  public async runProductEvents() {
    await this.eventService.runProductEvents();
  }

  @Get('kitchen/run-events')
  public async runKitchenEvents() {
    await this.eventService.runKitchenEvents();
  }

  @Get('payment/run-events')
  public async runPaymentEvents() {
    await this.eventService.runPaymentEvents();
  }

  @Get('menu/clear-read')
  public async clearMenuRead() {
    await this.eventService.clearMenuRead();
  }

  @Get('order/clear-read')
  public async clearOrderRead() {
    await this.eventService.clearOrderRead();
  }

  @Get('product/clear-read')
  public async clearProductRead() {
    await this.eventService.clearProductRead();
  }

  @Get('kitchen/clear-read')
  public async clearKitchenRead() {
    await this.eventService.clearKitchenRead();
  }

  @Get('payment/clear-read')
  public async clearPaymentRead() {
    await this.eventService.clearPaymentRead();
  }
}
