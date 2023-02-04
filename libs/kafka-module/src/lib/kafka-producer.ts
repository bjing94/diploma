import { Module } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';

@Module({})
export class KafkaProducerModule {
  private static clientId: string;
  private static brokers: string[];
  private static responseTopics: string[];

  static register(
    clientId: string,
    brokers: string[],
    responseTopics: string[]
  ): DynamicModule {
    this.clientId = clientId;
    this.brokers = brokers;
    this.responseTopics = responseTopics;

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
              producerOnlyMode: false,
            },
          },
        ]),
      ],
      providers: [
        KafkaProducerService,
        {
          provide: 'RESPONSE_TOPICS',
          useValue: responseTopics,
        },
      ],
      exports: [KafkaProducerService],
    };
  }
}
