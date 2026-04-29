import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Actions, AppAbility, Subjects } from '@shared/casl';
import { Request } from 'express';
import { CheckPolicies, ResponseMessage } from 'src/decorators/customize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Create, {
      __caslSubjectType__: Subjects.User,
      ...moreInfo?.user,
    } as any),
  )
  @ResponseMessage('Create user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Read, {
      __caslSubjectType__: Subjects.User,
      ...moreInfo?.user,
    } as any),
  )
  @ResponseMessage('Fetch all users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Read, {
      __caslSubjectType__: Subjects.User,
      ...moreInfo?.user,
    } as any),
  )
  @ResponseMessage('Find a user')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Update, {
      __caslSubjectType__: Subjects.User,
      ...moreInfo?.user,
    } as any),
  )
  @ResponseMessage('Update a user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility, request: Request, moreInfo) =>
    ability.can(Actions.Delete, {
      __caslSubjectType__: Subjects.User,
      ...moreInfo?.user,
    } as any),
  )
  @ResponseMessage('Delete a user')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
