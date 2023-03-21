import { Module } from '@nestjs/common';
import KafkaModule from '../kafka/kafka.module';
import KitchenController from './kitchen.controller';
import KitchenService from './kitchen.service';

@Module({
  imports: [KafkaModule],
  controllers: [KitchenController],
  providers: [KitchenService],
})
export default class KitchenModule {}
