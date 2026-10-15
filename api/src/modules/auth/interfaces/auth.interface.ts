import { MeResponse } from '@/modules/profile/interfaces/profile.interface';

export interface AccessTokenPayload {
  sub: string;
  role: string;
  typ: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  fid: string;
  jti: string;
  typ: 'refresh';
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: MeResponse;
  tokens: SessionTokens;
}

export interface OkResponse {
  ok: true;
}
