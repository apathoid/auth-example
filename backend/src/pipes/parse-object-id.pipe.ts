import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { isValidObjectId } from '@db';


@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
    transform(value: string, { type, data }: ArgumentMetadata) {
        if (type === 'param' && data === 'id' && !isValidObjectId(value)) {
            throw new BadRequestException('Request id is not a correct ObjectId');
        }

        return value;
    }
}
