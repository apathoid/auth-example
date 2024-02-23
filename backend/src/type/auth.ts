/** JWT payload */
export type JwtPayload = {
    sub: string;
    email: string;
};

/** Token verification result */
export type TokenVerificationResult = JwtPayload & {
    iat: number;
    exp: number;
};

/** Type of token(-s) used throughout the project */
export enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh'
};

/** Tokens-pair */
export type TokensPair = {
    accessToken: string;
    refreshToken?: string;
};
