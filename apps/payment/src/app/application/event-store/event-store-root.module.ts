import { EventStoreModule } from '@burger-shop/event-store';
import { Module } from '@nestjs/common';
import { getMongoEventStoreConnectionStringEventStore } from '../../config/mongoose.config';

@Module({
  imports: [
    EventStoreModule.registerForPayment(
      getMongoEventStoreConnectionStringEventStore()
    ),
  ],
  exports: [EventStoreModule],
})
export default class EventStoreRootModule {}
