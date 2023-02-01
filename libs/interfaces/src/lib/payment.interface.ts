export enum PaymentStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  CARD = 'card',
  CASH = 'cash',
  BITCOIN = 'bitcoin',
}

export class PaymentInfoResponse {}
