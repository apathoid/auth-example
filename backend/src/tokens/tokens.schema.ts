import { DBSchema, Prop, Schema, SchemaFactory } from '@db';


@Schema()
export class Token {
    @Prop({ type: DBSchema.Types.ObjectId, required: true, ref: 'User' })
    userId!: string;

    @Prop({ required: true })
    refreshTokenHash!: string;

    @Prop({ required: true })
    isActive!: boolean;
}


export const TokensSchema = SchemaFactory.createForClass(Token);
