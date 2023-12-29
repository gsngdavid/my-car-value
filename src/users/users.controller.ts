import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  BadRequestException,
  Session,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/Update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signIn(
    @Body() body: { email: string; password: string },
    @Session() session: any,
  ) {
    try {
      const user = await this.authService.signIn(body.email, body.password);
      session.userId = user.id;
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong email or password');
    }
  }

  @Get('whoami')
  async whoAmI(@Session() session: any) {
    console.log('Session: ', session);
    try {
      return await this.userService.findOne(session.userId);
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
    throw new InternalServerErrorException();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  find(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updates: UpdateUserDto) {
    return this.userService.updated(id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
