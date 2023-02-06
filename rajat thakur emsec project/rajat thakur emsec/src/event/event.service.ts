import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateEventDto, UpdateEventDto } from "../dtos";
import { Event, User } from "../entities";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(User) private userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    const events = await this.eventRepository.createQueryBuilder().getMany();

    return events;
  }

  async getEventById(id: string): Promise<Event> {
    const event = await this.eventRepository
      .createQueryBuilder()
      .leftJoin("Event.user", "user")
      .addSelect(["user.id", "user.email", "user.firstName", "user.lastName"])
      .where("Event.id = :id", { id: id })
      .getOne();

    if (!event) throw new HttpException("Invalid Id", HttpStatus.NOT_FOUND);

    return event;
  }

  async createEvent(token: string, data: CreateEventDto) {
    const payLoad: any = this.jwtService.decode(token.split(" ")[1]);
    const user = await this.userRepository.findOne({
      where: { id: payLoad.userId },
      relations: ["events"],
    });

    if (!user || !user.isActive)
      throw new HttpException("Invalid User", HttpStatus.NOT_FOUND);

    const event = this.eventRepository.create(data);
    user.events.push(event);
    await this.userRepository.save(user);

    return event;
  }

  async deleteEvent(token: string, id: string) {
    try {
      const payLoad: any = this.jwtService.decode(token.split(" ")[1]);

      const isEvent = await this.eventRepository
        .createQueryBuilder()
        .leftJoin("Event.user", "user")
        .addSelect(["user.id"])
        .where("user.id = :id AND Event.id = :eid", {
          id: payLoad.userId,
          eid: id,
        })
        .getOne();

      if (!isEvent)
        throw new HttpException(
          "Unauthorized for delete the event",
          HttpStatus.UNAUTHORIZED,
        );

      await this.eventRepository.delete(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateEvent(
    token: string,
    id: string,
    data: UpdateEventDto,
  ): Promise<Event> {
    const payLoad: any = this.jwtService.decode(token.split(" ")[1]);

    const isEvent = await this.eventRepository
      .createQueryBuilder()
      .leftJoin("Event.user", "user")
      .addSelect(["user.id"])
      .where("user.id = :id AND Event.id = :eid", {
        id: payLoad.userId,
        eid: id,
      })
      .getOne();

    if (!isEvent)
      throw new HttpException(
        "Unauthorized for Update the event",
        HttpStatus.UNAUTHORIZED,
      );

    const nowDate = new Date().getTime() - isEvent.date.getTime();
    if (nowDate > 0)
      throw new HttpException(
        "Can't update. Event is already occurred.",
        HttpStatus.FORBIDDEN,
      );

    await this.eventRepository.update(id, data);

    const event = await this.eventRepository
      .createQueryBuilder()
      .leftJoin("Event.user", "user")
      .addSelect(["user.id", "user.email", "user.firstName", "user.lastName"])
      .where("Event.id = :id", { id: id })
      .getOne();

    return event;
  }
}
