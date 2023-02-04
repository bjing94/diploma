export enum CommandTopics {
  orderCreate = 'order.create.command',
  orderComplete = 'order.complete.command',
  paymentCreate = 'payment.create.command',
  paymentFulfill = 'payment.fulfill.command',
  orderPay = 'order.pay.command',
  productCreate = 'product.create.command',
  productDelete = 'product.delete.command',
  productUpdate = 'product.update.command',
  menuCreate = 'menu.create.command',
  menuDelete = 'menu.delete.command',
  menuUpdate = 'menu.updated.command',
}

export enum QueryTopics {
  orderGet = 'order.get.query',
  paymentGet = 'payment.get.query',
  menuGet = 'menu.get.query',
  productGet = 'product.get.query',
  productFind = 'product.find.query',
}

export enum EventTopics {
  orderCompleted = 'order.updated.event',
  orderCreated = 'order.created.event',
  orderPayed = 'order.payed.event',
  productCreated = 'product.created.event',
  productUpdated = 'product.updated.event',
  productDeleted = 'product.deleted.event',
  menuCreated = 'menu.created.event',
}
