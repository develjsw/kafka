import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ProducerDto } from './dto/producer.dto';
import { KafkaProducerService } from './kafka.producer.service';

@Controller('kafka')
export class KafkaController {
    constructor(
        private readonly kafkaProducerService: KafkaProducerService
    ) {}

    @Post('producer')
    async producer(@Body(new ValidationPipe()) producerDto: ProducerDto) {
        await this.kafkaProducerService.connectProducer();
        await this.kafkaProducerService.sendMessage(
            producerDto.topic,
            producerDto.messages
        );
    }
}
