export function getMongoConnectionStringEventStore() {
  return `mongodb://root:root@${process.env.EVENT_DB_HOST}/?authMechanism=DEFAULT`;
}
export function getMongoConnectionStringReadDb() {
  return `mongodb://root:root@${process.env.READ_DB_HOST}/?authMechanism=DEFAULT`;
}
export const READ_CONNECTION_NAME = 'READ_DB';
