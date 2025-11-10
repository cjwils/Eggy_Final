import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';   
import { CreateUserDto } from './dto/create-user.dto'; 


@Controller('users') // Sets the base route for all methods in this controller to: /users
export class UsersController {
  // The service is injected so the controller can use its business methods
  constructor(private readonly usersService: UsersService) {}

  // 💡 Part: Route Decorator
  // @Post() maps POST requests sent to /users to this method.
  @Post() 
  async create(@Body() createUserDto: CreateUserDto) {
    // 💡 Part: Body Decorator and DTO Validation
    // @Body() extracts the JSON body of the request. NestJS automatically validates 
    // it against the rules defined in CreateUserDto.

    // 💡 Part: Delegating to the Service
    // The controller calls the service method, passing the clean DTO data. 
    // It doesn't know (or care) how the user is saved or the password is hashed.
    const user = await this.usersService.create(createUserDto);

    // 💡 Part: Response Handling
    // The Controller returns the result, which NestJS automatically converts into a 
    // 201 Created HTTP response with the user data (minus the password hash!).
    return { 
        id: user._id, 
        email: user.email, 
        message: 'User successfully created' 
    };
  }
}