import { OrderUpdateCommandRequest } from '@burger-shop/contracts';
import { OmitType } from '@nestjs/swagger';

export class OrderUpdateHttpRequest extends OmitType(
  OrderUpdateCommandRequest,
  ['id']
) {}
