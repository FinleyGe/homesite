import { createHash } from 'crypto';
export function generateHash(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function compareHash(password: string, hash: string): boolean {
  return createHash('sha256').update(password).digest('hex') === hash;
}
