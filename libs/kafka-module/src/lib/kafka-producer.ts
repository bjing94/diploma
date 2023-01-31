import { Module } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';

@Module({})
export class KafkaProducerModule {
  static register(clientId: string, brokers: string[]): DynamicModule {
    return {
      module: KafkaProducerModule,
      imports: [
        ClientsModule.register([
          {
            name: 'KAFKA_CLIENT',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: clientId,
                brokers,
              },
              producerOnlyMode: true,
            },
          },
        ]),
      ],
      providers: [KafkaProducerService],
      exports: [KafkaProducerService],
    };
  }
}
