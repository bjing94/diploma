export function getMongoEventStoreConnectionStringEventStore() {
  return `mongodb://root:root@localhost:27017/?authMechanism=DEFAULT`;
}
export function getMongoEventStoreConnectionStringReadDb() {
  return `mongodb://root:root@localhost:27018/?authMechanism=DEFAULT`;
}

export const READ_CONNECTION_NAME = 'READ_DB';
