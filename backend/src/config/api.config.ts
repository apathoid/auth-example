import { ConfigType, registerAs } from '@nestjs/config';


const apiConfig = registerAs('api', () => ({
    host: process.env.API_HOST || 'localhost',
    port: Number.parseInt(process.env.API_PORT || '5000', 10),
    urlPrefix: process.env.API_URL_PREFIX || '/api/v1'
}));


export type ApiConfig = ConfigType<typeof apiConfig>;
export default apiConfig;