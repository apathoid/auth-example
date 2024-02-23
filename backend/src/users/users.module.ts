import { Module } from '@nestjs/common';

import { DBModule } from '@db';
import { TokensModule } from '../tokens/tokens.module';

import { User, UsersSchema } from './users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


@Module({
    imports: [
        DBModule.forFeature([{ name: User.name, schema: UsersSchema }]),
        TokensModule
    ],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
