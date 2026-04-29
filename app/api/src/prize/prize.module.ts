import { Module } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Prize, PrizeSchema } from './schemas/prize.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prize.name, schema: PrizeSchema }]),
  ],
  providers: [PrizeService],
  exports: [PrizeService],
})
export class PrizeModule {}
