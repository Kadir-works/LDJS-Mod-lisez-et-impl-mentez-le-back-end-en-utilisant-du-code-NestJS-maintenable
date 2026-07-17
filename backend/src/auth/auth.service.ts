import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
// NestJS fournit automatiquement un objet jwtService.
// On appelle cela l'injection de dépendances
    constructor(private jwtService: JwtService) {}
  register(registerDto: RegisterDto) {
  console.log(registerDto);

  return {
    message: 'Utilisateur enregistré',
  };
}

  login(loginDto: LoginDto) {
  const payload = {
    email: loginDto.email,
  };

  const accessToken = this.jwtService.sign(payload);

  return {
    access_token: accessToken,
  };
}

  me() {
    return {
      message: 'Utilisateur courant',
    };
  }
}