import { ProductDocument } from '@burger-shop/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SnapshotAbstractRepository from '../../../application/repository/snapshot.abstract-repository';
import { READ_CONNECTION_NAME } from '../../../config/mongoose.config';
import ProductCreateDto from '../../../interfaces/product.create.dto';
import { SnapshotDocument, SnapshotModel } from '../model/snapshot.model';

export default class SnapshotRepository implements SnapshotAbstractRepository {
  constructor(
    @InjectModel(SnapshotModel.name, READ_CONNECTION_NAME)
    private readonly model: Model<SnapshotDocument>
  ) {}

  public async find(id: string): Promise<SnapshotDocument> {
    return this.model.findById(id).exec();
  }
  public async findMany(
    take: number,
    skip: number
  ): Promise<SnapshotDocument[]> {
    return this.model.find().limit(take).skip(skip).exec();
  }
  public async create(eventsCount: number): Promise<SnapshotDocument> {
    return this.model.create({ eventsCount });
  }
  public async getLatest(): Promise<SnapshotDocument> {
    return this.model
      .findOne()
      .sort({
        updatedAt: 'desc',
      })
      .exec();
  }
}
