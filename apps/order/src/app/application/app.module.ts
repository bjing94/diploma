import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  getMongoConnectionStringReadDb,
  READ_CONNECTION_NAME,
} from '../config/mongoose.config';
import {
  OrderModel,
  OrderSchema,
} from '../infrastructure/database/mongo/model/order.model';
import OrderRepository from '../infrastructure/database/mongo/repository/order.repository';
import EventStoreRootModule from './event-store/event-store-root.module';
import KafkaModule from './kafka/kafka.module';

import OrderCommandController from './order.command.controller';
import OrderCommandService from './order.command.service';
import OrderQueryController from './order.query.controller';
import OrderQueryService from './order.query.service';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoConnectionStringReadDb(), {
      connectionName: READ_CONNECTION_NAME,
    }),
    MongooseModule.forFeature(
      [{ name: OrderModel.name, schema: OrderSchema }],
      READ_CONNECTION_NAME
    ),
    KafkaModule,
    EventStoreRootModule,
  ],
  controllers: [OrderCommandController, OrderQueryController],
  providers: [
    OrderCommandService,
    OrderQueryService,
    {
      provide: 'OrderRepository',
      useClass: OrderRepository,
    },
  ],
})
export class AppModule {}
