import { Module } from '@nestjs/common';
import KafkaModule from '../kafka/kafka.module';
import MenuController from './menu.controller';
import MenuService from './menu.service';

@Module({
  imports: [KafkaModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export default class MenuModule {}
