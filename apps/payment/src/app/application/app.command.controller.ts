import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export default class AppCommandController {
  @MessagePattern()
  public async createPayment(@Payload() payload: any) {}
}
