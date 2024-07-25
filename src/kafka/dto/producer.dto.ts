import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ProducerDto {
    @IsNotEmpty()
    @IsString()
    topic: string;

    @IsNotEmpty()
    @IsArray()
    messages: [];
}
