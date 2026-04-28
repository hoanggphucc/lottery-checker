import { Injectable } from '@nestjs/common';
import { Role } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleNameEnum } from './role.type';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto) {
    return await this.roleModel.create(createRoleDto);
  }

  async findOneByName(name: RoleNameEnum) {
    return await this.roleModel.findOne({ name });
  }
}
