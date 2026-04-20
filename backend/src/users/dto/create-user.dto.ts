import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  name: string;

  @IsDateString()
  dob: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
