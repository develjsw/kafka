import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
    kafka: {
        brokers: {
            address1: 'kafka-1:9095',
            address2: 'kafka-2:9096',
            address3: 'kafka-3:9097',
        }
    }
}))