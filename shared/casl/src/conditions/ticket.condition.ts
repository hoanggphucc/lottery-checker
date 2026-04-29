import { IUser } from "../ability.types";

export const isOwnerTicket = (user: IUser) => ({
  user: user._id,
});
