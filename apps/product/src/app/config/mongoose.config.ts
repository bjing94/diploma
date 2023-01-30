export default function getMongoEventStoreConnectionString() {
  return `mongodb://root:root@localhost:27017/?authMechanism=DEFAULT`;
}

export function getMongoReadDbConntectionString() {
  return `mongodb://root:root@localhost:27018/?authMechanism=DEFAULT`;
}
