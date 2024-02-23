import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel, Model } from '@db';
import { User } from './users.schema';

import { UserDto, CreateUserDto, FindUserDto } from './dto';

import { TokensService } from '../tokens/tokens.service';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly usersModel: Model<User>,
        private readonly tokensService: TokensService
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        await this.checkIfUserDoesntExist(createUserDto.email);

        const user = await this.usersModel.create({ ...createUserDto, isActive: true });

        return UserDto.fromDocument(user);
    }

    async getUsers(): Promise<UserDto[]> {
        return (await this.usersModel.find()).map(UserDto.fromDocument);
    }

    async getUser(id: string): Promise<UserDto> {
        return UserDto.fromDocument(await this.findUserBy({ _id: id }));
    }

    async getUserByEmail(email: string): Promise<UserDto> {
        return UserDto.fromDocument(await this.findUserBy({ email }));
    }

    async deleteUser(id: string) {
        await this.usersModel.deleteOne({ _id: id });
        await this.tokensService.disableUserTokens(id);
    }

    async getUserPasswordHash(id: string) {
        return (await this.findUserBy({ _id: id })).password;
    }

    async checkIfUserDoesntExist(email: string) {
        try {
            if (await this.getUserByEmail(email)) {
                throw new ConflictException('The user already exists');
            }
        } catch (e) {
            if (!(e instanceof NotFoundException)) {
                throw e;
            }
        }
    }

    async findUserBy(user: FindUserDto) {
        const userDocument = await this.usersModel.findOne(user);

        if (!userDocument) {
            throw new NotFoundException('No such an user');
        }

        return userDocument;
    }
}
