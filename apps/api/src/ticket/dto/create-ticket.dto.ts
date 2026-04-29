import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  ticketNumber: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  province: string;
}
