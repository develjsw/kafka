import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
    kafka: {
        brokers: {
            address1: 'localhost:9095',
            address2: 'localhost:9096',
            address3: 'localhost:9097',
        }
    }
}))