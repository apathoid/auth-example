import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class CreateUserDto {
    @IsNotEmpty()
    readonly name!: string;

    @IsEmail()
    readonly email!: string;

    @IsString()
    readonly password!: string;
}
