export default function getMongoEventStoreConnectionStringOrder() {
  return `mongodb://root:root@localhost:27017/?authMechanism=DEFAULT`;
}

export enum DatabaseNames {
  orderEvents = 'order-events',
}
