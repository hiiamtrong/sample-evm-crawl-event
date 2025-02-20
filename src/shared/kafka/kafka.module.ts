import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from 'src/modules/configs/config.service';
import { BLOCKCHAIN_GROUP_ID, BLOCKCHAIN_MICROSERVICE } from 'src/shared/constants/crawler';

import { getKafkaConfig } from 'src/shared/utils/kafka';
@Global()
@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: BLOCKCHAIN_MICROSERVICE,
          useFactory: (config: AppConfigService) => {
            return {
              transport: Transport.KAFKA,
              options: {
                client: getKafkaConfig(config),
                consumer: {
                  groupId: BLOCKCHAIN_GROUP_ID,
                },
              },
            };
          },
          inject: [AppConfigService],
        },
      ],
    }),
  ],
  exports: [ClientsModule],
})
export class KafkaModule { }
