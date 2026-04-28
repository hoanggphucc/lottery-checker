import { Module } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { InitDatabaseService } from './init-database.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { Prize, PrizeSchema } from 'src/prize/schemas/prize.schema';
import { PrizeService } from 'src/prize/prize.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: Prize.name, schema: PrizeSchema }]),
  ],
  providers: [InitDatabaseService, UsersService, RolesService, PrizeService],
})
export class InitDatabaseModule {}
