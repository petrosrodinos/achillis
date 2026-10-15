import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessages } from '@/shared/config/error-codes';

/** Requires a valid access token (`wk_access` cookie, or `Authorization: Bearer` fallback). */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  handleRequest<TUser>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException(
        ErrorMessages.Auth.AUTHENTICATION_REQUIRED,
      );
    }
    return user;
  }
}

/** Attaches the user when a valid access token is present; never rejects. */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  handleRequest<TUser>(_err: unknown, user: TUser): TUser | null {
    return user || null;
  }
}
