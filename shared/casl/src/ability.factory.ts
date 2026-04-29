import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { AppAbilityBuilder, IUser } from "./ability.types";
import { applyBaseRules } from "./rules/base.rules";
import { applyAdminRules, applyUserRules } from "./rules/user.rules";
import { isAdmin } from "./conditions/user.condition";

export function defineAbilitiesForUser(user: IUser) {
  const builder = new AbilityBuilder(createMongoAbility) as AppAbilityBuilder;

  applyBaseRules(builder);
  if (isAdmin(user)) {
    applyAdminRules(builder);
  } else {
    applyUserRules(builder, user);
  }

  return builder.build();
}
