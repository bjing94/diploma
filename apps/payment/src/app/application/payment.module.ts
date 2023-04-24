import { EventStoreModule } from '@burger-shop/event-store';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  getMongoConnectionStringReadDb,
  READ_CONNECTION_NAME,
} from '../config/mongoose.config';
import PaymentModel, {
  PaymentSchema,
} from '../infrastructure/database/model/payment.model';
import PaymentRepository from '../infrastructure/database/repository/payment.repository';
import EventStoreRootModule from './event-store/event-store-root.module';
import KafkaRootModule from './kafka/kafka.module';
import PaymentCommandController from './payment.command.controller';
import PaymentCommandService from './payment.command.service';
import PaymentQueryController from './payment.query.controller';
import PaymentQueryService from './payment.query.service';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoConnectionStringReadDb(), {
      connectionName: READ_CONNECTION_NAME,
    }),
    MongooseModule.forFeature(
      [
        {
          name: PaymentModel.name,
          schema: PaymentSchema,
        },
      ],
      READ_CONNECTION_NAME
    ),
    KafkaRootModule,
    EventStoreRootModule,
  ],
  controllers: [PaymentCommandController, PaymentQueryController],
  providers: [
    PaymentQueryService,
    PaymentCommandService,
    {
      provide: 'PaymentRepository',
      useClass: PaymentRepository,
    },
  ],
})
export class PaymentModule {}
