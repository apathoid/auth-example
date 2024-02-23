import { TokenDto } from './token.dto';


export type SaveTokenDto = Omit<TokenDto, 'refreshTokenHash'> & {
    refreshToken: string;
};
