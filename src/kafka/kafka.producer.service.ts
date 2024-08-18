import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaProducerService {
    private kafka: Kafka;
    private producer: Producer;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.configService.get('config.kafka.brokers.address3')
        this.kafka = new Kafka({
            clientId: 'property-test',
            brokers: [
                this.configService.get('config.kafka.brokers.address1'),
                this.configService.get('config.kafka.brokers.address2'),
                this.configService.get('config.kafka.brokers.address3')
            ] // broker 외부 포트 설정
        });

        this.producer = this.kafka.producer();
    }

    async connectProducer(): Promise<void> {
        try {
            console.log('Connecting producer...');
            await this.producer.connect();
            console.log('Producer connected');
        } catch (error) {
            console.error('Error connecting producer:', error);
            throw new InternalServerErrorException(error);
        }
    }

    async sendMessage(
        topic: string,
        messages: { value: string }[],
    ): Promise<void> {
        const params = {
            topic,
            messages
        };

        try {
            console.log('Sending messages:', params);
            const result: RecordMetadata[] = await this.producer.send(params);
            console.log('Producer result:', result);
        } catch (error) {
            console.error('Error sending message:', error);
            throw new InternalServerErrorException(error);
        }
    }
}
