import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

import type { ApiConfig } from './config';

import { ValidationPipe } from '@nestjs/common';
import { ParseObjectIdPipe } from '@pipes';

import { Utils } from './utils';

import { AppModule } from './app.module';


async function main() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const apiConf = configService.get<ApiConfig>('api');

    if (!apiConf) {
        throw new Error('Application configuration is missing.');
    }

    app.setGlobalPrefix(apiConf.urlPrefix);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }), new ParseObjectIdPipe());
    app.use(cookieParser());

    const urlAuthority = Utils.constructURLAuthority(apiConf.host, apiConf.port);

    await app.listen(apiConf.port);
    console.log(`\n* App is listening on ${urlAuthority} *\n`);
}

main();
