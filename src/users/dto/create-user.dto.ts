// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

// 💡 Part: Defines the required properties for a new user object.
export class CreateUserDto {
  // 💡 Part: Validation Decorators
  // Ensures the input is a valid email format.
  @IsEmail({}, { message: 'Must be a valid email address.' })
  email: string;

  // Ensures the input is a string and is at least 8 characters long (for basic security).
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
