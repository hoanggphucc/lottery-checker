import { Injectable } from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Prize } from './schemas/prize.schema';
import { Model } from 'mongoose';
import { PrizeNameEnum } from './prize.type';

@Injectable()
export class PrizeService {
  constructor(@InjectModel(Prize.name) private prizeModel: Model<Prize>) {}

  async create(createRoleDto: CreatePrizeDto) {
    return await this.prizeModel.create(createRoleDto);
  }

  async findOneByName(name: PrizeNameEnum) {
    return await this.prizeModel.findOne({ name });
  }
}
