import { ConfigType, registerAs } from '@nestjs/config';

import { Utils } from '../utils';


const authConfig = registerAs('auth', () => {
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    const jwtAccessExpiry = process.env.JWT_ACCESS_EXPIRY ?? '15m';
    // If empty, refresh tokens will not be used at all
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRY ?? '1w';
    const tokenSalt = process.env.TOKEN_SALT;
    const passwordSalt = process.env.PASSWORD_SALT;

    const missingTokens: string[] = [];

    if (!jwtAccessSecret) {
        missingTokens.push('JWT_ACCESS_SECRET');
    }

    if (!tokenSalt) {
        missingTokens.push('TOKEN_SALT');
    }

    if (!passwordSalt) {
        missingTokens.push('PASSWORD_SALT');
    }

    if (missingTokens.length) {
        throw new ReferenceError(Utils.getMissingVarsMsg(missingTokens));
    }

    return {
        jwtAccessSecret: jwtAccessSecret!,
        jwtAccessExpiry,
        jwtRefreshSecret,
        jwtRefreshExpiry,
        tokenSalt: tokenSalt!,
        passwordSalt: passwordSalt!
    };
});


export type AuthConfig = ConfigType<typeof authConfig>;
export default authConfig;