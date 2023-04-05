import PaymentModel, {
  PaymentDocument,
} from '../../infrastructure/database/model/payment.model';

export default abstract class PaymentAbstractRepository {
  public abstract find(id: string): Promise<PaymentDocument>;
  public abstract create(payment: PaymentModel): Promise<PaymentDocument>;
  public abstract update(
    id: string,
    payment: PaymentModel
  ): Promise<PaymentDocument>;
  public abstract delete(id: string): Promise<void>;
  public abstract clearAll(): Promise<void>;
}
