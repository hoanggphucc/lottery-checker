import { SaveTicketDto } from './dto/save-ticket.dto';
import { Injectable } from '@nestjs/common';
import { checkLottery } from 'src/helpers/lottery.check';
import lotteryApi from '../helpers/lottery.api';
import { CheckTicketDto } from './dto/check-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import { Model } from 'mongoose';
import moment from 'moment';
import { PrizeService } from 'src/prize/prize.service';
import { PrizeNameEnum } from 'src/prize/prize.type';
import { FindProvinceDto } from './dto/find-province.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private prizeService: PrizeService,
  ) {}

  async check(checkTicketDto: CheckTicketDto, req?: Request) {
    const { ticketNumber, province, date } = checkTicketDto;
    const res = await lotteryApi('/vietnam/draws', {
      params: {
        code: province,
        date: date,
        limit: 1,
      },
    });
    const result = checkLottery(ticketNumber, res.data[0]);

    if (req?.user) {
      const isWinner = result?.length > 0;
      const prize = isWinner
        ? await this.prizeService.findOneByName(
            result[0].prize as PrizeNameEnum,
          )
        : null;
      const prizeId = prize?._id || '';
      const userId = (req?.user as any)?._id as string;
      await this.saveTicket({
        ticketNumber,
        date: moment(date, 'YYYY-MM-DD').toDate(),
        province,
        isWinner,
        prizeId: prizeId as string,
        userId: userId,
      });
    }

    return result;
  }

  async saveTicket(saveTicketDto: SaveTicketDto) {
    const { userId, ticketNumber, date, province, isWinner, prizeId } =
      saveTicketDto;
    const ticket = await this.ticketModel.findOne({
      user: userId,
      ticketNumber,
      date,
      province,
    });
    if (ticket) {
      await this.ticketModel.updateOne(ticket._id, {
        isWinner,
        ...(prizeId ? { prize: prizeId } : {}),
      });
    } else {
      await this.ticketModel.create({
        ticketNumber,
        date,
        province,
        isWinner,
        user: userId,
        ...(prizeId ? { prize: prizeId } : {}),
      });
    }
  }

  async findAllProvinces(findProvinceDto: FindProvinceDto) {
    const { name, page, limit } = findProvinceDto;
    const res = await lotteryApi('/vietnam/provinces', {
      params: {
        name,
        page,
        limit,
      },
    });
    return res;
  }

  async create(createTicketDto: CreateTicketDto, req: Request) {
    const { ticketNumber, date, province } = createTicketDto;
    const createdTicket = await this.ticketModel.create({
      ticketNumber,
      date,
      province,
      user: (req?.user as any)?._id,
    });
    return createdTicket;
  }

  async findAll(req: Request) {
    const ticketList = await this.ticketModel.find({
      user: (req?.user as any)?._id,
    });
    return ticketList;
  }

  async findOne(id: string) {
    const ticket = await this.ticketModel.findOne({
      _id: id,
    });
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
    return { success: true };
  }
}
