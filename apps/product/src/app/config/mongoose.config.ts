export function getMongoConnectionStringEventStore() {
  return `mongodb://root:root@localhost:27017/?authMechanism=DEFAULT`;
}
export function getMongoConnectionStringReadDb() {
  return `mongodb://root:root@localhost:27018/?authMechanism=DEFAULT`;
}

export const READ_CONNECTION_NAME = 'READ_DB';
