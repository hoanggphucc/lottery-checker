import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PrizeNameEnum } from '../prize.type';

export type PrizeDocument = HydratedDocument<PrizeNameEnum>;

@Schema({ timestamps: true })
export class Prize {
  @Prop()
  name: PrizeNameEnum;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PrizeSchema = SchemaFactory.createForClass(Prize);
