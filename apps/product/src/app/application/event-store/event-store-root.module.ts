import { EventStoreModule } from '@burger-shop/event-store';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EventStoreModule.register(
      'mongodb://root:root@localhost:27017/?authMechanism=DEFAULT'
    ),
  ],
  exports: [EventStoreModule],
})
export default class EventStoreRootModule {}
