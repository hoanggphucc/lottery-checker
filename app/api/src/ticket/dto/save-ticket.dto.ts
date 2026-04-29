import { IsNotEmpty } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class SaveTicketDto extends CreateTicketDto {
  @IsNotEmpty()
  isWinner: boolean;

  @IsNotEmpty()
  prize: string;

  @IsNotEmpty()
  userId: string;
}
