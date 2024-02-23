import { Module } from '@nestjs/common';
import { DBModule } from '@db';

import { authConfig } from '../config';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import {
    Token,
    TokensSchema
} from './tokens.schema';

import { TokensService } from './tokens.service';


@Module({
    imports: [
        ConfigModule.forFeature(authConfig),
        JwtModule.register({ global: false }),
        DBModule.forFeature([{ name: Token.name, schema: TokensSchema }])
    ],
    exports: [TokensService],
    providers: [TokensService]
})
export class TokensModule {}
