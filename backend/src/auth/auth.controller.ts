import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';

// On importe le service AuthService.
// C'est lui qui contiendra toute la logique métier (inscription, connexion...).
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt/jwt.guard';

// Ce contrôleur répondra à toutes les routes qui commencent par /auth.
@Controller('auth')
export class AuthController {

  // Le constructeur reçoit automatiquement une instance de AuthService.
  // C'est ce qu'on appelle l'injection de dépendances.
  // Grâce à cela, on peut utiliser les méthodes du service partout
  // dans ce contrôleur avec "this.authService".
  constructor(private readonly authService: AuthService) {}

  // Route POST /auth/register
  // Cette méthode sera appelée lorsqu'un utilisateur
  // envoie une requête POST vers /auth/register.
@Post('register')
register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}

  // Route POST /auth/login
  // Elle servira à connecter un utilisateur.
@Post('login')
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}

  // Route GET /auth/me
  // Elle permettra plus tard de récupérer
  // les informations de l'utilisateur connecté.
 @UseGuards(JwtGuard)
@Get('me')
me(@Req() request) {
  return this.authService.me(request.user);
}
}