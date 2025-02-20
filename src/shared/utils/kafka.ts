import { createMechanism } from '@jm18457/kafkajs-msk-iam-authentication-mechanism';
import { Logger } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { KafkaConfig } from '@nestjs/microservices/external/kafka.interface';
import { split } from 'lodash';
import { AppConfigService } from 'src/modules/configs/config.service';
import { sleep } from 'src/shared/utils/promise';

const getAWSKafkaConfig = (config: AppConfigService): KafkaConfig => {
  const clientId = config.kafka.clientId;
  const brokers = split(config.kafka.brokers, ',');
  const ssl = config.kafka.ssl;
  const region = config.kafka.region;
  const accessKeyId = config.kafka.accessKeyId;
  const secretAccessKey = config.kafka.secretAccessKey;
  const sasl = createMechanism({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return {
    clientId,
    brokers,
    ssl,
    sasl,
  };
};

export const getKafkaConfig = (config: AppConfigService): KafkaConfig => {
  const provider = config.kafka.provider;
  if (provider === 'msk') {
    return getAWSKafkaConfig(config);
  }
  return {
    clientId: config.kafka.clientId,
    brokers: split(config.kafka.brokers, ','),
  };
};

export async function heartbeatWrapped(
  context: KafkaContext,
  logger: Logger,
  name: string,
  handler: (context: KafkaContext) => Promise<void>,
  retryCount = 0,
) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000; // 3s
  const TIMEOUT = 30000; // 30s
  const INTERVAL = 10000; // 10s

  const heartbeat = context.getHeartbeat();

  // Send first heartbeat immediately
  await heartbeat();

  let isRunning = true;
  let heartbeatInterval: NodeJS.Timeout | null = null;
  let timeoutHandle: NodeJS.Timeout | null = null;

  // Start heartbeat interval
  heartbeatInterval = setInterval(async () => {
    if (!isRunning) return;

    try {
      logger.debug(`heartbeat: ${name}`);
      await heartbeat();
    } catch (error) {
      logger.error(`Failed to send heartbeat for ${name}:`, error);
    }
  }, INTERVAL);

  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Handler ${name} timed out after ${TIMEOUT}ms`));
    }, TIMEOUT);
  });

  try {
    // Race between handler and timeout
    await Promise.race([handler(context), timeoutPromise]);
  } catch (error) {
    // Check if it's a timeout error and we can retry
    if (error.message?.includes('timed out') && retryCount < MAX_RETRIES) {
      logger.warn(
        `${name} timed out, retrying (${retryCount + 1}/${MAX_RETRIES})...`,
      );

      // Clean up current timeouts and intervals
      isRunning = false;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (timeoutHandle) clearTimeout(timeoutHandle);

      // Wait before retrying
      await sleep(RETRY_DELAY);

      // Recursive retry with incremented counter
      return heartbeatWrapped(context, logger, name, handler, retryCount + 1);
    }

    logger.error(
      `Error in handler ${name} after ${retryCount} retries:`,
      error,
    );
    throw error;
  } finally {
    isRunning = false;

    // Safely clear interval and timeout
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}
