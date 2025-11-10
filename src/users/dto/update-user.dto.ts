// src/users/dto/update-user.dto.ts
import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  // 💡 Part: Optional Fields
  // @IsOptional() means the client doesn't have to send this field in the request body.
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address.' })
  email?: string; // Note the '?' making the property optional in TypeScript

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password?: string;
}