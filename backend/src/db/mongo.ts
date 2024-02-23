import {
    HydratedDocument as Document,
    PreMiddlewareFunction
} from 'mongoose';
import { AppConfig } from '../config';


export type PreMiddlewareFn<
    T extends object,
    C extends object = AppConfig
> = (config: C) => PreMiddlewareFunction<Document<T>>;

export type PreMiddlewareThis<T extends object> = ThisParameterType<
    PreMiddlewareFunction<Document<T>>
>;

export {
    Model,
    Schema as DBSchema,
    isValidObjectId
} from 'mongoose';
export {
    MongooseModule as DBModule,
    InjectModel,
    Prop,
    Schema,
    SchemaFactory
} from '@nestjs/mongoose';

export {
    Document,
    PreMiddlewareFunction
};
