import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { RoleEnum } from 'src/core/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    const user = await this.userModel.create({
      name,
      dob,
      email,
      password: hashPassword,
      role: RoleEnum.USER,
    });
    return user;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { name, dob, email, password } = createUserDto;
    const hashPassword = this.getHashPassword(password);
    const user = await this.userModel.create({
      name,
      dob,
      email,
      password: hashPassword,
      role: RoleEnum.ADMIN,
    });
    return user;
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = (await this.userModel.findById(id))?.toObject();
    const _user = { ...user };
    delete _user?.password;
    delete _user?.refreshToken;
    return _user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ email: username });
    return user;
  }

  async findByRole(role: RoleEnum) {
    const user = await this.userModel.find({ role });
    return user;
  }

  async findOneByToken(token: string) {
    const user = await this.userModel.findOne({ refreshToken: token });
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
    return 'ok';
  }

  async updateUserToken(_id: string, token: string) {
    return await this.userModel.updateOne({ _id }, { refreshToken: token });
  }
}
