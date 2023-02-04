// import {
//   OrderComplete,
//   OrderCreate,
//   OrderGetOrder,
//   OrderPay,
// } from '@burger-shop/contracts';
// import { KafkaProducerService } from '@burger-shop/kafka-module';
// import { BadRequestException, Injectable } from '@nestjs/common';

// @Injectable()
// export default class OrderService {
//   constructor(private readonly kafkaProducerService: KafkaProducerService) {}

//   public async create(dto: OrderCreate.Request) {
//     const result = await this.kafkaProducerService.send<
//       OrderCreate.Response,
//       OrderCreate.Request
//     >(OrderCreate.topic, dto);

//     if (!result) {
//       throw new BadRequestException('Order not created!');
//     }
//     return result;
//   }

//   public async get(id: string) {
//     throw new BadRequestException('Order not found!');
//     const result = this.kafkaProducerService.send<
//       OrderGetOrder.Response,
//       OrderGetOrder.Request
//     >(OrderGetOrder.topic, { id });

//     if (!result) {
//       throw new BadRequestException('Order not found!');
//     }
//     return result;
//   }

//   public async pay(id: string) {
//     return this.kafkaProducerService.send<OrderPay.Response, OrderPay.Request>(
//       OrderPay.topic,
//       { orderId: id }
//     );
//   }

//   public async complete(id: string) {
//     const response = await this.kafkaProducerService.send<
//       OrderComplete.Response,
//       OrderComplete.Request
//     >(OrderPay.topic, { orderId: id });
//     return response;
//   }
// }
