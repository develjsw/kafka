import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { KafkaProducerService } from './kafka.producer.service';

@Module({
    imports: [],
    controllers: [KafkaController],
    providers: [KafkaProducerService],
    exports: []
})
export class KafkaModule {}
