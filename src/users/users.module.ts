// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema'; // Assuming User and UserSchema are exported

@Module({
  imports: [
    // 1. Register the Mongoose Schema with the module
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [
    // 2. Register the Controller to expose API endpoints
    UsersController
  ],
  providers: [
    // 3. Register the Service to handle business logic
    UsersService
  ],
  exports: [
    // 4. Export the service so other modules (like AuthModule) can use it
    UsersService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ]
})
export class UsersModule {}