import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, defineAbilitiesForUser } from '@shared/casl';
import type { Request } from 'express';
import { CHECK_POLICIES_KEY, IS_PUBLIC_KEY } from 'src/decorators/customize';
import { TicketService } from 'src/ticket/ticket.service';
import { PolicyHandler } from './casl.types';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private ticketService: TicketService,
  ) {}

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
    const ticket = (
      await this.ticketService.findOne(request.params?.id)
    )?.toObject();

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, request, {
        user,
        ticket: {
          ...ticket,
          user: ticket?.user?._id,
        },
      }),
    );
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    request: Request,
    moreInfo?: any,
  ) {
    if (typeof handler === 'function') {
      return handler(ability, request, moreInfo);
    }
    return handler.handle(ability, request, moreInfo);
  }
}
