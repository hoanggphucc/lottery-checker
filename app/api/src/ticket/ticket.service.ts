import { Injectable } from '@nestjs/common';
import { checkLottery } from 'src/helpers/lottery.check';
import lotteryApi from '../helpers/lottery.api';
import { CheckTicketDto } from './dto/check-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  async check(checkTicketDto: CheckTicketDto) {
    const { ticketNumber, provinceCode, date } = checkTicketDto;
    const res = await lotteryApi('/vietnam/draws', {
      params: {
        code: provinceCode,
        date: date,
        limit: 1,
      },
    });
    const result = checkLottery(ticketNumber, res.data[0]);
    return result;
  }

  create(createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
