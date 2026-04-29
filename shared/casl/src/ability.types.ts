import { AbilityBuilder, MongoAbility } from "@casl/ability";

export enum Actions {
  Manage = "manage",
  Read = "read",
  Create = "create",
  Update = "update",
  Delete = "delete",
}

export enum Subjects {
  All = "all",
  User = "User",
  Ticket = "Ticket",
}

export type AppAbility = MongoAbility<[Actions, Subjects]>;
export type AppAbilityBuilder = AbilityBuilder<AppAbility>;

export interface IUser {
  _id: string;
  name: string;
  dob: string;
  email: string;
  password: string;
  role: string;
}
