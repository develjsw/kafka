import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import LocalConfig from './config/local.config';
import DevelopmentConfig from './config/development.config';

let config
switch (process.env.NODE_ENV) {
    case 'development':
        config = DevelopmentConfig;
        break;
    default:
        config = LocalConfig;
        break;
}

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        load: [config]
      }),
      KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
