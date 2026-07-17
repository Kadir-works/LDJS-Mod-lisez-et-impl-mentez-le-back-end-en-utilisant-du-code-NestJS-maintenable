import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(private jwtService: JwtService) {}

  canActivate(
  context: ExecutionContext,
): boolean {

  const request = context.switchToHttp().getRequest();

const authHeader = request.headers.authorization;

if (!authHeader) {
  throw new UnauthorizedException();
}

const token = authHeader.split(' ')[1];

try {
  const payload = this.jwtService.verify(token);

  console.log(payload);

  return true;
} catch {
  throw new UnauthorizedException();
}

}

}