import { createHash, randomBytes } from 'crypto';

export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const generateOpaqueToken = (bytes = 32): string =>
  randomBytes(bytes).toString('hex');
