export default abstract class OrderEventSourceAbstractRepository {
  public abstract saveEvent(
    type: string,
    data: any
  ): Promise<{ eventId: string }>;

  public abstract getEvent(id: string): Promise<{ type: string; data: any }>;
}
