import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto, LoginDto, UpdateUserDto } from "../dtos";
import { User } from "../entities";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async getAllUser(): Promise<User[]> {
    const users = await this.userRepository.createQueryBuilder().getMany();

    return users;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.create(userData);

      const data = await this.userRepository.save(user);
      return data;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const data = await this.userRepository
        .createQueryBuilder()
        .leftJoin("User.events", "events")
        .addSelect([
          "events.id",
          "events.name",
          "events.location",
          "events.date",
          "events.price",
        ])
        .where("User.id = :id", { id: id })
        .getOne();
      if (!data)
        throw new HttpException("No user found.", HttpStatus.NOT_FOUND);

      return data;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const data = await this.userRepository.findOne({ where: { id: id } });
      if (data) {
        await this.userRepository.delete(id);
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginCred: LoginDto) {
    try {
      const user = await this.validateUser(loginCred.email, loginCred.password);

      if (user) {
        const accessToken = this.jwtService.sign({
          type: "access",
          email: user.email,
          userId: user.id,
        });

        return { accessToken, user };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where("email = :email", { email: email })
      .getOne();
    if (user && user.validatePassword(pass)) {
      return user;
    }
    throw new Error("Invalid Cred");
  }

  async updateUser(id: string, payLoad: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, {
      firstName: payLoad.firstName,
      lastName: payLoad.lastName,
      gender: payLoad.gender,
    });

    const user = await this.findById(id);
    return user;
  }
}
