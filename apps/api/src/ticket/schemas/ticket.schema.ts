import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true })
  ticketNumber: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  province: string;

  @Prop()
  isWinner: boolean;

  @Prop()
  prize: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
