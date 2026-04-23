import { User } from "../ability.types";

export const isOwner = (user: User) => ({
  _id: user._id,
});

export const isAdmin = (user: User) => user.role.name === "ADMIN";
