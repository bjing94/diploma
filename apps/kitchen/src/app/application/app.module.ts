import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  getMongoConnectionStringReadDb,
  READ_CONNECTION_NAME,
} from '../config/mongoose.config';
import {
  CookingRequestModel,
  CookingRequestSchema,
} from '../infrastructure/model/cooking-request.model';
import {
  CookingStockModel,
  CookingStockSchema,
} from '../infrastructure/model/cooking-stock.model';
import CookingRequestRepository from '../infrastructure/repository/cooking-request.repository';
import CookingStockRepository from '../infrastructure/repository/cooking-stock.repository';
import EventStoreRootModule from './event-store/event-store-root.module';
import KafkaModule from './kafka/kafka.module';
import KitchenCommandController from './kitchen.command.controller';

import KitchenCommandService from './kitchen.command.service';
import KitchenQueryController from './kitchen.query.controller';
import KitchenQueryService from './kitchen.query.service';

@Module({
  imports: [
    EventStoreRootModule,
    KafkaModule,
    MongooseModule.forRoot(getMongoConnectionStringReadDb(), {
      connectionName: READ_CONNECTION_NAME,
    }),
    MongooseModule.forFeature(
      [
        { name: CookingRequestModel.name, schema: CookingRequestSchema },
        { name: CookingStockModel.name, schema: CookingStockSchema },
      ],
      READ_CONNECTION_NAME
    ),
  ],
  controllers: [KitchenCommandController, KitchenQueryController],
  providers: [
    KitchenCommandService,
    KitchenQueryService,
    {
      provide: 'CookingRequestRepository',
      useClass: CookingRequestRepository,
    },
    {
      provide: 'CookingStockRepository',
      useClass: CookingStockRepository,
    },
  ],
})
export class AppModule {}
