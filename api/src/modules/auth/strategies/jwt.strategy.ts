import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_COOKIE } from '@/shared/config/cookies';
import { AuthenticatedUser } from '@/shared/decorators/current-user.decorator';
import { AccessTokenPayload } from '../interfaces/auth.interface';

const fromAccessCookie = (req: Request): string | null =>
  req?.cookies?.[ACCESS_COOKIE] ?? null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      // Cookie first (browser client); Bearer header kept as a fallback for tests/tools.
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromAccessCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  validate(payload: AccessTokenPayload): AuthenticatedUser {
    if (!payload?.sub || payload.typ !== 'access')
      throw new UnauthorizedException();
    return { id: payload.sub, role: payload.role };
  }
}
