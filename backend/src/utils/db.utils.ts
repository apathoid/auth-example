import { Document } from '@db';


export class DBUtils {
    /** Converts a database document into a plain object, stripping DB-related properties from it */
    static toObject<T extends object>(document: Document<T>) {
        const documentObject = document.toObject<T & { __v: number }>();

        const { _id, __v, ...object } = documentObject;

        return object;
    }
}