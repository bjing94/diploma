export const CONNECTION_NAME = 'EVENT_STORE';
export enum ResourceNames {
  PRODUCT = 'product',
  MENU = 'MENU',
  ORDER = 'order',
  PAYMENT = 'payment',
  COOKING_REQUEST = 'cooking_request',
  COOKING_STOCK = 'cooking_stock',
}

export const SNAPSHOT_FREQUENCY = 5;

export enum OrderEventNames {
  orderCreated = 'order.created.event',
  orderPayed = 'order.payed.event',
  orderReadyForPickup = 'order.ready_for_pickup.event',
  orderCompleted = 'order.completed.event',
  orderCanceled = 'order.canceled.event',
  orderSnapshot = 'order.snapshot.event',
}

export enum ProductEventNames {
  productCreated = 'product.created.event',
  productUpdated = 'product.updated.event',
  productSnapshot = 'product.snapshot.event',
}

export enum MenuEventNames {
  menuCreated = 'menu.created.event',
  menuActivated = 'menu.activated.event',
  menuDeactivated = 'menu.deactivated.event',
  menuItemsUpdated = 'menu.items-updated.event',
  menuSnapshot = 'menu.snapshot.event',
}

export enum PaymentEventNames {
  paymentCreated = 'payment.created.event',
  paymentFulfilled = 'payment.fulfilled.event',
  paymentRefunded = 'payment.refunded.event',
  paymentRejected = 'payment.rejected.event',
  paymentSnapshot = 'payment.snapshot.event',
}

export enum CookingStockEventNames {
  stockCreated = 'stock.created.event',
  stockQuantityChanged = 'stock.quantity-changed.event',
  stockSnapshot = 'stock.snapshot.event',
}

export enum CookingRequestEventNames {
  requestCreated = 'cooking-request.created.event',
  requestReady = 'cooking-request.ready.event',
  requestRejected = 'cooking-request.rejected.event',
  requestSnapshot = 'cooking-request.snapshot.event',
}
