import { EventModel } from '@burger-shop/models';
import EventResponse from './dto/event.response.dto';

export default class EventMapper {
  public static toResponse(model: EventModel): EventResponse {
    return {
      objectId: model.objectId,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      payload: model.payload,
      id: model.id,
    };
  }
  public static toResponseMany(models: EventModel[]): EventResponse[] {
    return models.map(this.toResponse);
  }
}
