import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { ErrorMessages } from '@/shared/config/error-codes';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
export const CSRF_HEADER = 'x-requested-with';
export const CSRF_HEADER_VALUE = 'XMLHttpRequest';

/**
 * Cookie auth CSRF defence (contracts §1): every state-changing request must carry
 * `X-Requested-With: XMLHttpRequest`. Cross-site forms cannot set custom headers, and
 * cross-origin fetches with custom headers require a CORS preflight that only allowed origins pass.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') return true;
    const request = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.has(request.method.toUpperCase())) return true;

    if (request.headers[CSRF_HEADER] !== CSRF_HEADER_VALUE) {
      throw new ForbiddenException(ErrorMessages.Auth.CSRF_HEADER_MISSING);
    }
    return true;
  }
}
