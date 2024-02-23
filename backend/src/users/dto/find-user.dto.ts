import { UserDto } from './user.dto';


export interface FindUserDto extends Partial<Omit<UserDto, 'id'>> {
    _id?: string;
}
