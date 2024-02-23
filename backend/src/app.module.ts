import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DBModule } from '@db';

import { APP_ROOT } from '@constants/app';
import { apiConfig, dbConfig, authConfig } from './config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: (process.env.IGNORE_ENV_FILE ?? 'false') === 'true',
            ignoreEnvVars: (process.env.IGNORE_ENV_VARS ?? 'false') === 'true',
            envFilePath: [
                `${APP_ROOT}/.env.${process.env.NODE_ENV}.local`,
                `${APP_ROOT}/.env.${process.env.NODE_ENV}`
            ],
            load: [apiConfig, dbConfig, authConfig]
        }),
        DBModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (conf: ConfigService) => ({
                uri: conf.get<string>('db.uri')
            })
        }),
        UsersModule,
        AuthModule,
        TokensModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
