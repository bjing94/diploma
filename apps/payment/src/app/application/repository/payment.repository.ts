import PaymentModel from '../../infrastructure/database/model/payment.model';

export default abstract class PaymentAbstractRepository {
  public abstract find(id: number): Promise<PaymentModel>;
  public abstract create(payment: PaymentModel): Promise<PaymentModel>;
  public abstract update(
    id: number,
    payment: PaymentModel
  ): Promise<PaymentModel>;
  public abstract delete(id: string): Promise<void>;
}
