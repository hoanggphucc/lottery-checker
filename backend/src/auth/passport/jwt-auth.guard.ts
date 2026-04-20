import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/customize';
import { Role } from 'src/roles/schemas/role.schema';
import { RoleNameEnum } from 'src/roles/types.role';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const userRole = (user.role as unknown as Role).name;

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const targetEndpoint: string = request.route?.path || '';
    if (targetEndpoint.includes('users') && userRole !== RoleNameEnum.ADMIN) {
      throw new ForbiddenException();
    }

    return user;
  }
}
