import { Module } from '@nestjs/common';
import KafkaModule from '../kafka/kafka.module';
import OrderController from './order.controller';
import OrderService from './order.service';

@Module({
  imports: [KafkaModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export default class OrderModule {}
