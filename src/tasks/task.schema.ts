import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title!: string;
  @Prop({ trim: true })
  description?: string;
  @Prop({ default: false })
  done!: boolean;
}
export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);