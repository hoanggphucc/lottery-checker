import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InitDatabaseService } from './init-database.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [InitDatabaseService, UsersService],
})
export class InitDatabaseModule {}
