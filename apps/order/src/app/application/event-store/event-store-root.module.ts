import { EventStoreModule } from '@burger-shop/event-store';
import { Module } from '@nestjs/common';
import { getMongoConnectionStringEventStore } from '../../config/mongoose.config';

@Module({
  imports: [EventStoreModule.register(getMongoConnectionStringEventStore())],
  exports: [EventStoreModule],
})
export default class EventStoreRootModule {}
