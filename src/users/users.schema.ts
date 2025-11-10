import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 💡 Part: Defining the Document Type
export type UserDocument = User & Document;

// 💡 Part: The Schema Decorator
// @Schema() marks this class as a Mongoose schema
@Schema()
export class User {
  // 💡 Part: Prop Decorators
  // @Prop() defines a property (field) in the MongoDB collection.
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // This is where the HASHED password will be stored.
}

// 💡 Part: Creating the Schema Factory
// SchemaFactory is needed by MongooseModule to link this class to the database.
export const UserSchema = SchemaFactory.createForClass(User);
