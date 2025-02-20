import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { get, map } from 'lodash';
dotenv.config();

export type TRedisType = 'single' | 'cluster';

export interface IEnvConfig {
  APP_ENV: string;
  APP_PORT: number;
  APP_HOST: string;

  KAFKA_PROVIDER: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_BROKERS: string;
  KAFKA_SSL: boolean;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;

  REDIS_PASS: string;
  REDIS_TYPE: TRedisType;
  REDIS_URL: string;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;

  CONTRACT_ADDRESS: string;
  CONTRACT_START_BLOCK: number;
  CONTRACT_INCREMENT_BLOCK: number;
  CONTRACT_CHAIN_ID: string;

  READ_RPC_URL: string;
  WRITE_RPC_URL: string;
}

export interface IAppConfig {
  env: string;
  port: number;
  host: string;
}

export interface IKafkaConfig {
  provider: string;
  clientId: string;
  brokers: string;
  ssl: boolean;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface IRedisConfig {
  type: TRedisType;
  url: string;
  pass: string;
}

export interface IDBConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  pass: string;
}

export interface IContractConfig {
  address: string;
  startBlock: number;
  incrementBlock: number;
  chainId: string;
  readRpcUrl: string;
  writeRpcUrl: string;
}

export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);
  private readonly envConfig: IEnvConfig;
  private readonly validationScheme = {
    APP_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
    APP_HOST: Joi.string().default('localhost'),

    KAFKA_PROVIDER: Joi.string().required().valid('kafka', 'msk'),
    KAFKA_CLIENT_ID: Joi.string().required(),
    KAFKA_BROKERS: Joi.string().required(),
    KAFKA_SSL: Joi.boolean().optional().default(false),

    REDIS_PASS: Joi.string().required(),
    REDIS_TYPE: Joi.string().required().valid('single', 'cluster'),
    REDIS_URL: Joi.string().required(),

    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),

    CONTRACT_ADDRESS: Joi.string().required(),
    CONTRACT_START_BLOCK: Joi.number().required(),
    CONTRACT_INCREMENT_BLOCK: Joi.number().required(),
    CONTRACT_CHAIN_ID: Joi.string().required(),

    READ_RPC_URL: Joi.string().required(),
    WRITE_RPC_URL: Joi.string().required(),
  };

  constructor() {
    this.envConfig = this.validateInput(process.env);
    this.logger.log(
      'AppConfigService -> constructor -> this.envConfig',
      JSON.stringify(this.envConfig, null, 2),
    );
  }

  private validateInput(envConfig: dotenv.DotenvParseOutput): IEnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(this.validationScheme);
    const validation = envVarsSchema.validate(envConfig, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });
    if (validation.error) {
      throw new Error(
        `Config validation error:\n${map(
          get(validation, 'error.details'),
          (x) => x.message,
        ).join('\n')}`,
      );
    }

    // ignore unknown keys
    const validatedEnvConfig = validation.value as IEnvConfig;
    return validatedEnvConfig;
  }

  get app(): IAppConfig {
    return {
      env: String(this.envConfig.APP_ENV),
      port: this.envConfig.APP_PORT,
      host: String(this.envConfig.APP_HOST),
    };
  }

  get kafka(): IKafkaConfig {
    return {
      provider: String(this.envConfig.KAFKA_PROVIDER),
      clientId: String(this.envConfig.KAFKA_CLIENT_ID),
      brokers: String(this.envConfig.KAFKA_BROKERS),
      ssl: Boolean(this.envConfig.KAFKA_SSL),
      region: String(this.envConfig.AWS_REGION),
      accessKeyId: String(this.envConfig.AWS_ACCESS_KEY_ID),
      secretAccessKey: String(this.envConfig.AWS_SECRET_ACCESS_KEY),
    };
  }

  get redis(): IRedisConfig {
    return {
      type: this.envConfig.REDIS_TYPE,
      url: String(this.envConfig.REDIS_URL),
      pass: String(this.envConfig.REDIS_PASS),
    };
  }

  get db(): IDBConfig {
    return {
      host: String(this.envConfig.DB_HOST),
      port: this.envConfig.DB_PORT,
      name: String(this.envConfig.DB_NAME),
      user: String(this.envConfig.DB_USER),
      pass: String(this.envConfig.DB_PASS),
    };
  }

  get contract(): IContractConfig {
    return {
      address: String(this.envConfig.CONTRACT_ADDRESS),
      startBlock: this.envConfig.CONTRACT_START_BLOCK,
      incrementBlock: this.envConfig.CONTRACT_INCREMENT_BLOCK,
      chainId: this.envConfig.CONTRACT_CHAIN_ID,
      readRpcUrl: String(this.envConfig.READ_RPC_URL),
      writeRpcUrl: String(this.envConfig.WRITE_RPC_URL),
    };
  }
}
