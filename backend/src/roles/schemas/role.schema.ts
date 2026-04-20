import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleNameEnum } from '../types.role';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: RoleNameEnum;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
