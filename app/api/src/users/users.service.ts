import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { RolesService } from 'src/roles/roles.service';
import { RoleNameEnum } from 'src/roles/role.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private roleService: RolesService,
  ) {}

  getHashPassword(plainPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
  }

  isValidPassword(plainPassword: string, hashPassword: string) {
    return bcrypt.compareSync(plainPassword, hashPassword);
  }

  async create(createUserDto: CreateUserDto) {
    const { name, dob, email, password } = createUserDto;
    const hashPassword = this.getHashPassword(password);
    const roleUser = await this.roleService.findOneByName(RoleNameEnum.USER);
    const user = await this.userModel.create({
      name,
      dob,
      email,
      password: hashPassword,
      role: roleUser!._id,
    });
    return user;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { name, dob, email, password } = createUserDto;
    const hashPassword = this.getHashPassword(password);
    const roleAdmin = await this.roleService.findOneByName(RoleNameEnum.ADMIN);
    const user = await this.userModel.create({
      name,
      dob,
      email,
      password: hashPassword,
      role: roleAdmin!._id,
    });
    return user;
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel
      .findOne({ email: username })
      .populate('role');
    return user;
  }

  async findByRole(roleName: RoleNameEnum) {
    const role = await this.roleService.findOneByName(roleName);
    const user = await this.userModel.find({ role: role!._id });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        name: updateUserDto.name,
        dob: updateUserDto.dob,
      },
    );
  }

  async remove(id: string) {
    await this.userModel.deleteOne({ _id: id });
    return { success: true };
  }
}
