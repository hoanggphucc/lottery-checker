import { IsNotEmpty, Matches } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  ticketNumber: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date: string;

  @IsNotEmpty()
  province: string;
}
