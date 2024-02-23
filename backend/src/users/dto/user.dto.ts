import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { Document } from '@db';

import { User } from '../users.schema';
import { DBUtils } from '../../utils';


export class UserDto implements Omit<User, 'password'> {
    @IsString()
    readonly id!: string;

    @IsNotEmpty()
    readonly name!: string;

    @IsEmail()
    readonly email!: string;

    @IsBoolean()
    readonly isActive!: boolean;


    static fromDocument(user: Document<User>) {
        const { password: _password, ...userObject } = DBUtils.toObject(user);
        userObject.id = user._id.toHexString();

        return userObject;
    }
}
