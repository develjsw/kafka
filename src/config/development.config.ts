import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
    kafka: {
        brokers: {
            address1: '52.78.56.128:9095',
            address2: '52.78.56.128:9096',
            address3: '52.78.56.128:9097',
        }
    }
}))