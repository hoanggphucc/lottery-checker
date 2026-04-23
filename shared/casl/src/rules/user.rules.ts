import { Actions, AppAbilityBuilder, Subjects, User } from "../ability.types";
import { isOwner } from "../conditions/user.condition";

export function applyUserRules({ can }: AppAbilityBuilder, user: User) {
  can(Actions.Read, Subjects.User, isOwner(user));
  can(Actions.Update, Subjects.User, isOwner(user));
}

export function applyAdminRules({ can }: AppAbilityBuilder) {
  can(Actions.Create, Subjects.User);
  can(Actions.Read, Subjects.User);
  can(Actions.Update, Subjects.User);
  can(Actions.Delete, Subjects.User);
}
