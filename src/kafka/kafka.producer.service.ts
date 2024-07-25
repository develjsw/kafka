import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Kafka, Partitioners, Producer, RecordMetadata } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
    private kafka: Kafka;
    private producer: Producer;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'property-test',
            brokers: ['kafka-1:9094', 'kafka-2:9095', 'kafka-3:9096']
        });

        this.producer = this.kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner
        });
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
        messages: { value: string }[]
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
