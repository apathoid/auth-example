import * as express from './express';
import { JwtPayload } from '@type/auth';


export type Request = express.Request & {
    user?: JwtPayload;
};

export type Response = express.Response;