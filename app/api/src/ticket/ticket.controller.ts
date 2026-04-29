import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CheckTicketDto } from './dto/check-ticket.dto';
import { Public } from 'src/decorators/customize';
import { FindProvinceDto } from './dto/find-province.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Public()
  @Get('/check/public')
  checkTicketPublic(@Query() checkTicketDto: CheckTicketDto) {
    return this.ticketService.check(checkTicketDto);
  }

  @Get('/check')
  checkTicket(@Query() checkTicketDto: CheckTicketDto, @Request() req) {
    return this.ticketService.check(checkTicketDto, req);
  }

  @Public()
  @Get('/provinces')
  findAllProvinces(@Query() findProvinceDto: FindProvinceDto) {
    return this.ticketService.findAllProvinces(findProvinceDto);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.ticketService.create(createTicketDto, req);
  }

  @Get()
  findAll(@Request() req) {
    return this.ticketService.findAll(req);
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
