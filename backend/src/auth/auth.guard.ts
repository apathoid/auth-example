import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { TokenType } from '@type/auth';

import type { Request } from '../platform';

import { IS_PUBLIC_KEY } from '@decorators/public-endpoint.decorator';

import { TokensService } from '../tokens/tokens.service';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly tokensService: TokensService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Authorize to get access');
        }

        const payload = await this.tokensService.verifyToken(TokenType.ACCESS, token);
        request['user'] = payload;

        return true;
    }


    private extractToken(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
