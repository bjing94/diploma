import { Serializer } from '@nestjs/microservices';

export class CustomSerializer implements Serializer {
  public serialize(data: Buffer): unknown {
    const stringifiedData = data.toString();

    // do stuff here...

    return stringifiedData;
  }
}
