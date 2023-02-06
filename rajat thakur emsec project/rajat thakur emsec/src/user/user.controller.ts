import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../utils";
import { CreateUserDto, LoginDto, UpdateUserDto } from "../dtos";
import { User } from "../entities";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async deleteUser(@Param("id") id: string) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/me")
  async getProfile(@Headers("authorization") token: string): Promise<User> {
    try {
      const payLoad: any = this.jwtService.decode(token.split(" ")[1]);
      return await this.userService.findById(payLoad.userId);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put("/me")
  async updateProfile(
    @Headers("authorization") token: string,
    @Body(ValidationPipe) data: UpdateUserDto,
  ): Promise<User> {
    try {
      const payLoad: any = this.jwtService.decode(token.split(" ")[1]);
      return await this.userService.updateUser(payLoad.userId, data);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/all")
  async getUser(): Promise<User[]> {
    try {
      return this.userService.getAllUser();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:id")
  async getById(@Param("id") id: string): Promise<User> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post("/login")
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body(ValidationPipe) data: LoginDto) {
    try {
      return await this.userService.login(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("/signup")
  @UseInterceptors(ClassSerializerInterceptor)
  async createUser(@Body(ValidationPipe) data: CreateUserDto): Promise<User> {
    try {
      return this.userService.createUser(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
