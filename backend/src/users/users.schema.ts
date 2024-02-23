import { Prop, Schema, SchemaFactory } from '@db';


@Schema()
export class User {
    @Prop()
    id!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true })
    isActive!: boolean;

    @Prop()
    password!: string;
}


export const UsersSchema = SchemaFactory.createForClass(User);
