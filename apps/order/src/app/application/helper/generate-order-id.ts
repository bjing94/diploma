export function generateOrderId(): string {
  return (Math.random() * (100000 - 0) + 0).toString();
}
