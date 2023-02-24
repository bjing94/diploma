import { SnapshotDocument } from '../../infrastructure/database/model/snapshot.model';

export default abstract class SnapshotAbstractRepository {
  public abstract find(id: string): Promise<SnapshotDocument>;
  public abstract findMany(
    take: number,
    skip: number
  ): Promise<SnapshotDocument[]>;
  public abstract create(eventsCount: number): Promise<SnapshotDocument>;
  public abstract getLatest(): Promise<SnapshotDocument>;
}
