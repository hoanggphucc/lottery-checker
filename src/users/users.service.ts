import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword(plainPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, dob, email, password } = createUserDto;
    const hashPassword = this.getHashPassword(password);
    const user = await this.userModel.create({
      name,
      dob,
      email,
      password: hashPassword,
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
