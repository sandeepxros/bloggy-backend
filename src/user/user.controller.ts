import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { CreateUserDto } from './dto/user.dto';
import { User } from './model/user.model';
import { GetUser } from './user.decorator';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @Public()
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return {
      status: 'ok',
      user: user.id,
      message: 'User created successfully',
    };
  }

  @Get('whoAmI')
  @ApiOperation({ summary: 'Get the information of logged in user' })
  async whoAmI(@GetUser('sub') userId: string) {
    const user = (await this.userService.findUserById(userId)).toObject();
    delete user.password;
    return {
      status: 'ok',
      user,
      message: 'data fetched successfully',
    };
  }
}
