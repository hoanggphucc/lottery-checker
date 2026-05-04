import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dob: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
