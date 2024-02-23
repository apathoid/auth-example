import { IsString } from 'class-validator';

import { JwtPayload, TokenVerificationResult } from '@type/auth';
import { UserDto } from '../../users/dto';


export class JwtPayloadDto implements JwtPayload {
    @IsString()
    sub!: string;

    @IsString()
    email!: string;


    static fromUser(userDto: UserDto): JwtPayload {
        const payload: JwtPayload = {
            sub: userDto.id,
            email: userDto.email
        };

        return payload;
    }

    static fromVerificationResult(result: TokenVerificationResult): JwtPayload {
        const { iat: _iat, exp: _exp, ...payload } = result;

        return payload;
    }
}