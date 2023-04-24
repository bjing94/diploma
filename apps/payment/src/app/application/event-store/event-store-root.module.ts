import { EventStoreModule } from '@burger-shop/event-store';
import { Module } from '@nestjs/common';
import { getMongoConnectionStringEventStore } from '../../config/mongoose.config';

@Module({
  imports: [
    EventStoreModule.registerForPayment(getMongoConnectionStringEventStore()),
  ],
  exports: [EventStoreModule],
})
export default class EventStoreRootModule {}
