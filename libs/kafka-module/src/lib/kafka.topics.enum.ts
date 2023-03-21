export enum CommandTopics {
  orderCreate = 'order.create.command',
  orderUpdate = 'order.update.command',
  paymentCreate = 'payment.create.command',
  paymentUpdate = 'payment.update.command',
  orderPay = 'order.pay.command',
  productCreate = 'product.create.command',
  productDelete = 'product.delete.command',
  productUpdate = 'product.update.command',
  menuCreate = 'menu.create.command',
  menuDelete = 'menu.delete.command',
  menuUpdate = 'menu.update.command',
  cookingRequestCreate = 'cooking-request.created.command',
  cookingRequestUpdate = 'cooking-request.update.command',
  cookingStockAdd = 'cooking-stock.add.command',
}

export enum QueryTopics {
  orderGet = 'order.get.query',
  paymentGet = 'payment.get.query',
  menuGet = 'menu.get.query',
  productGet = 'product.get.query',
  productFind = 'product.find.query',
  menuItemGet = 'menu-item.get.query',
  menuFind = 'menu.find.query',
  cookingRequestGet = 'cooking-request.get.query',
  cookingStockGet = 'cooking-stock.get.query',
}

export enum EventTopics {
  orderCreated = 'order.created.event',
  orderUpdated = 'order.updated.event',
  productCreated = 'product.created.event',
  productUpdated = 'product.updated.event',
  productDeleted = 'product.deleted.event',
  menuCreated = 'menu.created.event',
  menuUpdated = 'menu.updated.event',
  paymentCreated = 'payment.created.event',
  paymentStatusUpdated = 'payment.status-updated.event',
  cookingRequestCreated = 'cooking-request.created.event',
  cookingRequestUpdated = 'cooking-request.updated.event',
  cookingStockCreated = 'cooking-stock.created.event',
  cookingStockUpdated = 'cooking-stock.updated.event',
}
