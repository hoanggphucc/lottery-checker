import { Actions, AppAbilityBuilder, Subjects, IUser } from "../ability.types";
import { isOwnerTicket } from "../conditions/ticket.condition";
import { isOwner } from "../conditions/user.condition";

export function applyUserRules({ can }: AppAbilityBuilder, user: IUser) {
  can(Actions.Read, Subjects.User, isOwner(user));
  can(Actions.Update, Subjects.User, isOwner(user));

  can(Actions.Read, Subjects.Ticket, isOwnerTicket(user));
  can(Actions.Update, Subjects.Ticket, isOwnerTicket(user));
  can(Actions.Delete, Subjects.Ticket, isOwnerTicket(user));
}

export function applyAdminRules({ can }: AppAbilityBuilder) {
  can(Actions.Manage, Subjects.User);
  can(Actions.Manage, Subjects.Ticket);
}
