// src/users/dto/login-user.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  // We need the email to find the user in the database
  @IsEmail({}, { message: 'Must be a valid email address.' })
  email: string;

  // We need the password to compare against the stored hash
  @IsString()
  password: string;
}