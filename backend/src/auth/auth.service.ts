import {
    Injectable, Inject, UnauthorizedException, NotFoundException
} from '@nestjs/common';
import argon2 from 'argon2';

import { AuthConfig } from '../config';
import { JwtPayload, TokenType } from '@type/auth';

import { authConfig } from '../config';

import { LoginUserDto } from './dto';
import { CreateUserDto } from '../users/dto';
import { JwtPayloadDto } from '../tokens/dto';

import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokensService: TokensService,
        @Inject(authConfig.KEY) private readonly authConf: AuthConfig
    ) {}

    async register(createUserDto: CreateUserDto) {
        await this.usersService.checkIfUserDoesntExist(createUserDto.email);

        const passwordHash = await this.getPasswordHash(createUserDto.password);
        const user = await this.usersService.createUser({ ...createUserDto, password: passwordHash });

        const tokens = await this.updateTokens(JwtPayloadDto.fromUser(user));

        return tokens;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.tryFindUser(loginUserDto.email);
        const passwordHash = await this.usersService.getUserPasswordHash(user.id);
        const isValidPassword = await argon2.verify(passwordHash, loginUserDto.password, {
            salt: Buffer.from(this.authConf.tokenSalt)
        });

        if (!isValidPassword) {
            throw new UnauthorizedException('Wrong password');
        }

        const tokens = await this.updateTokens(JwtPayloadDto.fromUser(user));

        return tokens;
    }

    async refresh(refreshToken: string) {
        const result = await this.tokensService.verifyToken(TokenType.REFRESH, refreshToken);
        const token = await this.tokensService.getTokenByRefresh(refreshToken, result.sub);

        if (!token.isActive) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const tokens = await this.updateTokens(JwtPayloadDto.fromVerificationResult(result));

        return tokens;
    }


    private async tryFindUser(email: string) {
        try {
            const user = await this.usersService.getUserByEmail(email);

            return user;
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new UnauthorizedException('The user doesn\'t exist');
            }

            throw e;
        }
    }

    private async updateTokens(payload: JwtPayload) {
        const tokens = await this.tokensService.generateTokens(payload);

        if (tokens.refreshToken) {
            await this.tokensService.disableUserTokens(payload.sub);
            await this.tokensService.saveToken(tokens.refreshToken, payload.sub);
        }

        return tokens;
    }

    private getPasswordHash(password: string) {
        return argon2.hash(password, { salt: Buffer.from(this.authConf.passwordSalt) });
    }
}
