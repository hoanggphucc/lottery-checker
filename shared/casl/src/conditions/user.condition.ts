import { IUser } from "../ability.types";

export const isOwner = (user: IUser) => ({
  _id: user._id,
});

export const isAdmin = (user: IUser) => user.role === "ADMIN";
