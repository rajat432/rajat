import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @MaxLength(3000)
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsNotEmpty()
  location: string;

  @IsOptional()
  price: number;

  @IsNotEmpty()
  maxSeats: number;
}

export class UpdateEventDto {
  @IsOptional()
  @MaxLength(32)
  name: string;

  @MaxLength(3000)
  @IsOptional()
  description: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsOptional()
  location: string;

  @IsOptional()
  price: number;

  @IsOptional()
  maxSeats: number;
}
