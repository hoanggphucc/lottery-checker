import type { AppAbility } from '@shared/casl';
import type { Request } from 'express';

interface IPolicyHandler {
  handle(ability: AppAbility, request: Request): boolean;
}

type PolicyHandlerCallback = (
  ability: AppAbility,
  request: Request,
) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
