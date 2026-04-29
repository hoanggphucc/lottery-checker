import { IsNotEmpty } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class SaveTicketDto extends CreateTicketDto {
  @IsNotEmpty()
  isWinner: boolean;

  @IsNotEmpty()
  prizeId: string;

  @IsNotEmpty()
  userId: string;
}
