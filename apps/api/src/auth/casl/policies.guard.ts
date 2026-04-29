import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PolicyHandler } from './casl.types';
import { CHECK_POLICIES_KEY, IS_PUBLIC_KEY } from 'src/decorators/customize';
import { AppAbility, defineAbilitiesForUser } from '@shared/casl';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const ability = defineAbilitiesForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, request),
    );
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    request: Request,
  ) {
    if (typeof handler === 'function') {
      return handler(ability, request);
    }
    return handler.handle(ability, request);
  }
}
