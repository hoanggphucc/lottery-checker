import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public, User } from 'src/decorators/customize';
import { CheckTicketDto } from './dto/check-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { FindProvinceDto } from './dto/find-province.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Public()
  @Get('/check/public')
  checkTicketPublic(@Query() checkTicketDto: CheckTicketDto) {
    return this.ticketService.check(checkTicketDto);
  }

  @Get('/check')
  checkTicket(@Query() checkTicketDto: CheckTicketDto, @User() user) {
    return this.ticketService.check(checkTicketDto, user);
  }

  @Public()
  @Get('/provinces')
  findAllProvinces(@Query() findProvinceDto: FindProvinceDto) {
    return this.ticketService.findAllProvinces(findProvinceDto);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @User() user) {
    return this.ticketService.create(createTicketDto, user);
  }

  @Get()
  findAll(@User() user) {
    return this.ticketService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
