import type { ApiConfig } from './api.config';
import type { DBConfig } from './db.config';
import type { AuthConfig } from './auth.config';
import { ConfigService } from '@nestjs/config';


export type AppConfig = {
    api: ApiConfig;
    db: DBConfig;
    auth: AuthConfig;
};

export const getAppConfig = (configService: ConfigService<AppConfig>) => {
    const api = configService.get('api', { infer: true });
    const db = configService.get('db', { infer: true });
    const auth = configService.get('auth', { infer: true });

    if (!api) {
        throw new ReferenceError('"api" configuration object is missing');
    }

    if (!db) {
        throw new ReferenceError('"db" configuration object is missing');
    }

    if (!auth) {
        throw new ReferenceError('"auth" configuration object is missing');
    }

    const appConfig: AppConfig = { api, db, auth };

    return appConfig;
};

export type {
    ApiConfig,
    DBConfig,
    AuthConfig
};

export { default as apiConfig } from './api.config';
export { default as dbConfig } from './db.config';
export { default as authConfig } from './auth.config';
