export function generateOrderId(): string {
  return Math.floor(Math.random() * (100000 - 0) + 0).toString();
}
