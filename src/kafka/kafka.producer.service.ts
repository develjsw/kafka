import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
    private kafka: Kafka;
    private producer: Producer;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'property-test',
            // TODO : 개발서버 아이피로 고정 설정, 환경변수로 개발/로컬/운영 나뉘어질 수 있도록 변경 필요
            brokers: ['52.78.56.128:9095', '52.78.56.128:9096', '52.78.56.128:9097'] // broker 외부 포트 설정
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
