import { PaymentUpdateCommandRequest } from '@burger-shop/contracts';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import PaymentService from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export default class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @ApiOperation({ description: 'Run payment events' })
  @Get('run-events')
  public async runProductEvents(): Promise<void> {
    return this.service.runEvents();
  }

  @Get(':id')
  public async getPayment(@Param('id') id: string) {
    return this.service.getPayment(id);
  }

  @Patch(':id')
  public async updatePayment(
    @Param('id') id: string,
    @Body() dto: PaymentUpdateCommandRequest
  ) {
    return this.service.updatePayment(id, dto.status);
  }
}
