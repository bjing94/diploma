import PaymentDomainEntity from '../../domain/entity/payment.domain-entity';
import PaymentModel from '../../infrastructure/database/model/payment.model';

export default class PaymentMapper {
  public static toDomain(payment: PaymentModel): PaymentDomainEntity {
    return new PaymentDomainEntity(
      payment.status,
      payment.sum,
      payment.type,
      payment.id,
      payment.link
    );
  }
}
