import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { Prize, PrizeSchema } from 'src/prize/schemas/prize.schema';
import { PrizeService } from 'src/prize/prize.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: Prize.name, schema: PrizeSchema }]),
  ],
  controllers: [TicketController],
  providers: [TicketService, PrizeService],
})
export class TicketModule {}
