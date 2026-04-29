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
import {
  CheckPolicies,
  Public,
  ResponseMessage,
  User,
} from 'src/decorators/customize';
import { CheckTicketDto } from './dto/check-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { FindProvinceDto } from './dto/find-province.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';
import { FindTicketDto } from './dto/find-ticket.dto';
import { Actions, AppAbility, Subjects } from '@shared/casl';
import { Request } from 'express';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Public()
  @Get('/check/public')
  @ResponseMessage('Check Ticket')
  checkTicketPublic(@Query() checkTicketDto: CheckTicketDto) {
    return this.ticketService.check(checkTicketDto);
  }

  @Get('/check')
  @ResponseMessage('Check Ticket')
  checkTicket(@Query() checkTicketDto: CheckTicketDto, @User() user) {
    return this.ticketService.check(checkTicketDto, user);
  }

  @Public()
  @Get('/provinces')
  @ResponseMessage('Fetch all provinces')
  findAllProvinces(@Query() findProvinceDto: FindProvinceDto) {
    return this.ticketService.findAllProvinces(findProvinceDto);
  }

  @Post()
  @ResponseMessage('Create ticket')
  create(@Body() createTicketDto: CreateTicketDto, @User() user) {
    return this.ticketService.create(createTicketDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all tickets')
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Read, {
      __caslSubjectType__: Subjects.Ticket,
      ...moreInfo?.ticket,
    } as any),
  )
  findAll(@Query() findTicketDto: FindTicketDto, @User() user) {
    return this.ticketService.findAll(findTicketDto, user);
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Read, {
      __caslSubjectType__: Subjects.Ticket,
      ...moreInfo?.ticket,
    } as any),
  )
  @ResponseMessage('Find a ticket')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Update, {
      __caslSubjectType__: Subjects.Ticket,
      ...moreInfo?.ticket,
    } as any),
  )
  @ResponseMessage('Update a ticket')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Delete, {
      __caslSubjectType__: Subjects.Ticket,
      ...moreInfo?.ticket,
    } as any),
  )
  @ResponseMessage('Delete a ticket')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
