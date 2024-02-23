import {
    Body, Controller, Inject, Post, Response, UnauthorizedException
} from '@nestjs/common';
import ms from 'ms';

import {
    Response as PlatformResponse
} from '../platform';

import { REFRESH_TOKEN_COOKIE } from '@constants/auth';
import { Public, Cookies } from '@decorators';
import { AuthConfig, authConfig } from '../config';

import { CreateUserDto } from '../users/dto';
import { LoginUserDto } from './dto';

import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    private refreshTokenCookieMaxAge: number;

    constructor(
        private readonly authService: AuthService,
        @Inject(authConfig.KEY) private readonly authConf: AuthConfig
    ) {
        this.refreshTokenCookieMaxAge = ms(authConf.jwtRefreshExpiry);
    }

    @Public()
    @Post('register')
    async register(
        @Response({ passthrough: true }) response: PlatformResponse,
        @Body() createUserDto: CreateUserDto
    ) {
        const { accessToken, refreshToken } = await this.authService.register(createUserDto);

        if (refreshToken) {
            response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
                httpOnly: true,
                maxAge: this.refreshTokenCookieMaxAge
            });
        }

        return { accessToken };
    }

    @Public()
    @Post('login')
    async login(
        @Response({ passthrough: true }) response: PlatformResponse,
        @Body() loginUserDto: LoginUserDto
    ) {
        const { accessToken, refreshToken } = await this.authService.login(loginUserDto);

        if (refreshToken) {
            response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
                httpOnly: true,
                maxAge: this.refreshTokenCookieMaxAge
            });
        }

        return { accessToken };
    }

    @Public()
    @Post('refresh')
    async refresh(
        @Cookies(REFRESH_TOKEN_COOKIE) refreshToken: string,
        @Response({ passthrough: true }) response: PlatformResponse
    ) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is missing');
        }

        const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken);

        response.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, {
            httpOnly: true,
            maxAge: this.refreshTokenCookieMaxAge
        });

        return { accessToken };
    }
}
