import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import { checkLottery, CheckLotteryReturn } from 'src/helpers/lottery.check';
import { User } from 'src/users/schemas/user.schema';
import lotteryApi from '../helpers/lottery.api';
import { CheckTicketDto } from './dto/check-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { FindProvinceDto } from './dto/find-province.dto';
import { SaveTicketDto } from './dto/save-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './schemas/ticket.schema';
import { FindTicketDto } from './dto/find-ticket.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private mailService: MailService,
  ) {}

  async check(checkTicketDto: CheckTicketDto, user?: User) {
    const { ticketNumber, province, date } = checkTicketDto;
    const res = await lotteryApi('/vietnam/draws', {
      params: {
        code: province,
        date: date,
        limit: 1,
      },
    });
    const result = checkLottery(ticketNumber, res.data[0]);

    if (user) {
      const userId = (user as any)?._id as string;
      await this.saveTicket(
        {
          ticketNumber,
          date,
          province,
        },
        result,
        userId,
      );
    }

    return result;
  }

  async saveTicket(
    saveTicketDto: SaveTicketDto,
    result: CheckLotteryReturn[],
    userId: string,
  ) {
    const { ticketNumber, date, province } = saveTicketDto;
    const isWinner = result?.length > 0;
    const prize = isWinner ? result[0]?.prize : '';
    const ticket = await this.ticketModel.findOne({
      user: userId,
      ticketNumber,
      date,
      province,
    });
    if (ticket) {
      await this.ticketModel.updateOne(
        { _id: ticket._id },
        {
          isWinner,
          prize,
        },
      );
    } else {
      await this.ticketModel.create({
        ticketNumber,
        date,
        province,
        isWinner,
        prize,
        user: userId,
      });
    }
  }

  async findAllProvinces(findProvinceDto: FindProvinceDto) {
    const { name, page, limit } = findProvinceDto;
    const res: any = await lotteryApi('/vietnam/provinces', {
      params: {
        name,
        page,
        limit,
      },
    });
    return {
      result: res.data,
      meta: {
        page: res.meta.page,
        limit: res.meta.limit,
        total: res.meta.total,
      },
    };
  }

  async create(createTicketDto: CreateTicketDto, user: User) {
    const { ticketNumber, date, province } = createTicketDto;
    const createdTicket = await this.ticketModel.create({
      ticketNumber,
      date,
      province,
      user: (user as any)?._id,
    });
    return createdTicket;
  }

  async findAll(findTicketDto: FindTicketDto, user: User) {
    const { page, limit } = findTicketDto;

    const defaultLimit = +(limit || 100);
    const defaultPage = +(page || 1);
    const offset = (defaultPage - 1) * defaultLimit;
    const total = (
      await this.ticketModel.find({
        user: (user as any)?._id,
      })
    ).length;

    const ticketList = await this.ticketModel
      .find({
        user: (user as any)?._id,
      })
      .skip(offset)
      .limit(defaultLimit);

    return {
      result: ticketList,
      meta: {
        page: defaultPage,
        limit: defaultLimit,
        total,
      },
    };
  }

  async findOne(id: string) {
    const ticket = await this.ticketModel
      .findOne({
        _id: id,
      })
      .populate('user');
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const { ticketNumber, date, province } = updateTicketDto;
    const updatedTicket = await this.ticketModel.updateOne(
      {
        _id: id,
      },
      {
        ticketNumber,
        date,
        province,
      },
    );
    return updatedTicket;
  }

  async remove(id: string) {
    await this.ticketModel.deleteOne({ _id: id });
    return 'ok';
  }

  @Cron('0 45 16 * * *', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  // @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCheckTicketDaily() {
    const tickets = await this.ticketModel
      .find({
        date: moment().format('YYYY-MM-DD'),
      })
      .populate('user');
    if (tickets.length === 0) return;

    for (const ticket of tickets) {
      const result = await this.check(
        {
          ticketNumber: ticket.ticketNumber,
          province: ticket.province,
          date: ticket.date,
        },
        ticket.user as unknown as User,
      );
      if (result.length > 0) {
        await this.mailService.send({
          subject: 'Thông báo trúng thưởng',
          template: 'win-ticket',
          context: {
            prize: result[0].prize,
            ticketNumber: ticket.ticketNumber,
            date: moment(ticket.date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            province: ticket.province,
          },
        });
      }
    }
  }
}
