import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import argon2 from 'argon2';

import { JwtPayload, TokenType, TokenVerificationResult, TokensPair as TokensPairType } from '@type/auth';
import { InjectModel, Model } from '@db';
import { Token } from './tokens.schema';

import { AuthConfig, authConfig } from '../config';
import { TokenDto, FindTokenDto } from './dto';

import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TokensService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(authConfig.KEY) private readonly authConf: AuthConfig,
        @InjectModel(Token.name) private readonly tokensModel: Model<Token>,
    ) {}

    async generateTokens(payload: JwtPayload): Promise<TokensPairType> {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.authConf.jwtAccessSecret,
            expiresIn: this.authConf.jwtAccessExpiry
        });

        const refreshToken = this.authConf.jwtRefreshSecret ? await this.jwtService.signAsync(payload, {
            secret: this.authConf.jwtRefreshSecret,
            expiresIn: this.authConf.jwtRefreshExpiry
        }) : undefined;

        return { accessToken, refreshToken };
    }

    async saveToken(refreshToken: string, userId: string): Promise<TokenDto> {
        const refreshTokenHash = await this.getTokenHash(refreshToken);
        const tokenDocument = await this.tokensModel.create<Token>({
            userId,
            refreshTokenHash,
            isActive: true
        });

        return TokenDto.fromDocument(tokenDocument);
    }

    async disableUserTokens(userId: string) {
        await this.tokensModel.updateMany({ userId, isActive: true }, { isActive: false });
    }

    async getTokenByRefresh(refreshToken: string, userId: string): Promise<TokenDto> {
        const token = await this.findTokenBy({ userId, isActive: true });
        const match = await argon2.verify(token.refreshTokenHash, refreshToken, {
            salt: Buffer.from(this.authConf.tokenSalt)
        });

        if (!match) {
            throw new NotFoundException('No such a token');
        }

        return TokenDto.fromDocument(token);
    }

    async verifyToken(type: TokenType, token: string): Promise<TokenVerificationResult> {
        try {
            const payload = await this.jwtService.verifyAsync<TokenVerificationResult>(
                token,
                {
                    secret:
                        type === TokenType.ACCESS
                            ? this.authConf.jwtAccessSecret
                            : this.authConf.jwtRefreshSecret
                }
            );

            return payload;
        } catch {
            throw new UnauthorizedException(`Invalid ${type} token`);
        }
    }

    getTokenHash(token: string) {
        return argon2.hash(token, { salt: Buffer.from(this.authConf.tokenSalt) });
    }

    async findTokenBy(findTokenDto: FindTokenDto) {
        const token = await this.tokensModel.findOne(findTokenDto);

        if (!token) {
            throw new NotFoundException('No such a token');
        }

        return token;
    }
}
