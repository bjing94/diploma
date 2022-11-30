import { Entity, Column, CreateDateColumn } from 'typeorm';
import BaseEntity from './base.entity';

@Entity('order')
export default class OrderEntity extends BaseEntity<OrderEntity> {
  @Column()
  public id: string;

  @Column()
  public status: string;

  //   orderItems: OrderItemDomainEntity[];

  //   paymentInfo: PaymentInfoDomainEntity;

  //   deliveryInfo: DeliveryInfoDomainEntity;

  @CreateDateColumn()
  public createdAt: Date;
}
