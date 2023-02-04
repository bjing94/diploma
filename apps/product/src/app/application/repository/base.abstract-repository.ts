import mongoose from 'mongoose';
import { Document } from 'mongoose';

export default abstract class BaseAbstractRepository<T extends Document> {
  private _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  async findById(_id: string): Promise<T> {
    return this._model.findById(_id);
  }
}
