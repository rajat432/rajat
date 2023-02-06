import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { AuthController, UserController } from "./user.controller";
import { User } from "../entities";
import { JwtStrategy } from "../utils";

import "dotenv/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
