import { Module } from '@nestjs/common';
import PaymentCommandController from './payment.command.controller';
import PaymentCommandService from './payment.command.service';
import PaymentQueryController from './payment.query.controller';
import PaymentQueryService from './payment.query.service';

@Module({
  imports: [],
  controllers: [PaymentCommandController, PaymentQueryController],
  providers: [PaymentQueryService, PaymentCommandService],
})
export class PaymentModule {}
