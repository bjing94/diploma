// import { MenuCreate, ProductCreate } from '@burger-shop/contracts';
// import { KafkaProducerService } from '@burger-shop/kafka-module';
// import { Inject, Injectable } from '@nestjs/common';
// import { ClientKafka } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';
// import { kafkaConfig } from '../../config/provide-kafka-config';

// @Injectable()
// export default class MenuService {
//   constructor(private readonly kafkaProducerService: KafkaProducerService) {}

//   public async create(dto: MenuCreate.Request): Promise<any> {
//     // return lastValueFrom(
//     //   this.kafkaClient.send<MenuCreate.Response, MenuCreate.Request>(
//     //     MenuCreate.topic,
//     //     dto
//     //   )
//     // );
//   }
// }
