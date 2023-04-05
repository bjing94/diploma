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

export function getMongoConnectionStringEventStore() {
  return `mongodb://root:root@localhost:27017/?authMechanism=DEFAULT`;
}