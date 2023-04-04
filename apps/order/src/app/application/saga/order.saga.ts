import { OrderStatus } from '@burger-shop/interfaces';
import CreateOrderSagaState from './order.state';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { EventStoreOrderService } from '@burger-shop/event-store';
import {
  CreateOrderCanceledStep,
  CreateOrderMarkCompleteStep,
  CreateOrderMarkReadyStep,
  CreateOrderNewStep,
  CreateOrderPayStep,
} from './order.steps';

export default class CreateOrderSaga {
  private state: CreateOrderSagaState;

  constructor(
    public readonly kafkaProducerService: KafkaProducerService,
    public readonly eventStoreService: EventStoreOrderService
  ) {}

  getState() {
    return this.state;
  }

  setState(status: OrderStatus) {
    if (status === OrderStatus.NEW) {
      this.state = new CreateOrderNewStep();
    }
    if (status === OrderStatus.CREATED) {
      this.state = new CreateOrderPayStep();
    }
    if (status === OrderStatus.PAYED) {
      this.state = new CreateOrderMarkReadyStep();
    }
    if (status === OrderStatus.WAITING_FOR_PICKUP) {
      this.state = new CreateOrderMarkCompleteStep();
    }
    if (status === OrderStatus.CANCELED) {
      this.state = new CreateOrderCanceledStep();
    }

    this.state.setContext(this);
  }
}
