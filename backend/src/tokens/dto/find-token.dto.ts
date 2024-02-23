import { TokenDto } from './token.dto';


export type FindTokenDto = Partial<TokenDto> & {
    _id?: string;
};
