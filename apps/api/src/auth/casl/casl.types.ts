import type { AppAbility } from '@shared/casl';
import type { Request } from 'express';

interface IPolicyHandler {
  handle(ability: AppAbility, request: Request, moreInfo?: any): boolean;
}

type PolicyHandlerCallback = (
  ability: AppAbility,
  request: Request,
  moreInfo?: any,
) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
