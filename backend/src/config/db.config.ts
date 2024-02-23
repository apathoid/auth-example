import { ConfigType, registerAs } from '@nestjs/config';

import { Utils } from '../utils';


const dbConfig = registerAs('db', () => ({
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '27017'),
    name: process.env.DB_NAME || 'test_db',
    get uri() {
        const uri = (
            process.env.DB_URI ||
            `mongodb://${Utils.constructURLAuthority(this.host, this.port)}/${this.name}`
        );

        return uri;
    }
}));


export type DBConfig = ConfigType<typeof dbConfig>;
export default dbConfig;
