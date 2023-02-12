import { Types } from 'mongoose';

export function helpers(): string {
  return 'helpers';
}

export function generateObjectId(): string {
  return new Types.ObjectId().toString();
}
