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
}

export type AppAbility = MongoAbility<[Actions, Subjects]>;
export type AppAbilityBuilder = AbilityBuilder<AppAbility>;

export interface User {
  _id: string;
  name: string;
  dob: string;
  email: string;
  password: string;
  role: { id: string; name: string };
}
