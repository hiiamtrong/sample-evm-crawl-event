
import './shared/utils/json'

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerModule } from 'src/modules/consumer/consumer.module';
import { AppConfigService } from 'src/modules/configs/config.service';
import { BLOCKCHAIN_GROUP_ID } from 'src/shared/constants/crawler';
import { getKafkaConfig } from 'src/shared/utils/kafka';



async function bootstrap() {
    const app = await NestFactory.create(ConsumerModule);
    const config = app.get(AppConfigService);
    await initMicroservices(app, config);
    await app.init();
}

bootstrap();

const initMicroservices = async (
    app: INestApplication,
    config: AppConfigService,
) => {
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: getKafkaConfig(config),
            consumer: {
                groupId: BLOCKCHAIN_GROUP_ID,
            },
            run: {
                autoCommit: false,
            },
        },
    });

    await app.startAllMicroservices();
};
