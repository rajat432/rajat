import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
} from "class-validator";

enum genderType {
  male = "male",
  female = "female",
  trans = "trans",
}

export class CreateUserDto {
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(genderType)
  gender: genderType;
}

export class LoginDto {
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(genderType)
  gender: genderType;
}
