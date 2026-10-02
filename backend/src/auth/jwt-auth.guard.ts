import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}

	handleRequest<TUser>(error: unknown, user: TUser | false) {
		// Toute erreur de token doit être une réponse HTTP 401, jamais une erreur 500.
		if (error || !user) {
			throw new UnauthorizedException('Token JWT invalide ou absent');
		}

		return user;
	}
}