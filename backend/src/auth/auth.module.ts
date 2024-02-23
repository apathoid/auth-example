import { Module } from '@nestjs/common';

import { authConfig } from '../config';

import { AuthGuard } from './auth.guard';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
    imports: [
        ConfigModule.forFeature(authConfig),
        UsersModule,
        TokensModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: 'APP_GUARD',
            useClass: AuthGuard
        }
    ]
})
export class AuthModule {}
