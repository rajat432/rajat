import {
  Body,
  Controller,
  Get,
  HttpException,
  Headers,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
  Delete,
  Param,
  Put,
} from "@nestjs/common";
import { JwtAuthGuard } from "../utils";
import { EventService } from "./event.service";
import { Event } from "../entities";
import { CreateEventDto, UpdateEventDto } from "../dtos";

@Controller("/event")
export class eventController {
  constructor(private readonly eventService: EventService) {}

  @Get("/all")
  async getAllEvents(): Promise<Event[]> {
    try {
      return await this.eventService.getAllEvents();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(
    @Body(ValidationPipe) data: CreateEventDto,
    @Headers("authorization") token: string,
  ) {
    try {
      return await this.eventService.createEvent(token, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async deleteEvent(
    @Headers("authorization") token: string,
    @Param("id") id: string,
  ) {
    try {
      return this.eventService.deleteEvent(token, id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/:id")
  async getEventById(@Param("id") id: string) {
    try {
      return this.eventService.getEventById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  async updateEvent(
    @Headers("authorization") token: string,
    @Param("id") id: string,
    @Body(ValidationPipe) data: UpdateEventDto,
  ) {
    try {
      return this.eventService.updateEvent(token, id, data);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
