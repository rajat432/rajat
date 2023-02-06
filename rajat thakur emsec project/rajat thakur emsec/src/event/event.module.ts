import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "../utils";
import { Event, User } from "../entities";
import { eventController } from "./event.controller";
import { EventService } from "./event.service";

import "dotenv/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [eventController],
  providers: [JwtStrategy, EventService],
})
export class EventModule {}
