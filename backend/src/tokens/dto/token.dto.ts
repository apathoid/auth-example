import { Document } from '@db';
import { IsBoolean, IsString } from 'class-validator';

import { Token } from '../tokens.schema';

import { DBUtils } from '../../utils';


export class TokenDto {
    @IsString()
    userId!: string;

    @IsString()
    refreshTokenHash!: string;

    @IsBoolean()
    isActive!: boolean;


    static fromDocument(token: Document<Token>): TokenDto {
        return DBUtils.toObject(token);
    }
}
