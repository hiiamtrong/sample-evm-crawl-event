import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { RedisClusterConfig } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';
import { AppConfigService } from 'src/modules/configs/config.service';

export const getRedisConfig = (
    config: AppConfigService,
): RedisModuleOptions => {
    if (config.redis.type === 'cluster') {
        return {
            type: 'cluster',
            nodes: config.redis.url.split(','),
            options: {
                redisOptions: {
                    password: config.redis.pass,
                },
            },
        };
    }

    return {
        type: 'single',
        url: config.redis.url,
        options: {
            password: config.redis.pass,
        },
    };
};

export const getRedisStoreConfig = (
    config: AppConfigService,
): RedisOptions | { clusterConfig: RedisClusterConfig } => {
    if (config.redis.type === 'cluster') {
        return {
            clusterConfig: {
                nodes: config.redis.url.split(','),
                options: {
                    redisOptions: {
                        password: config.redis.pass,
                    },
                },
            },
        };
    }
    const url = new URL(config.redis.url);
    return {
        host: url.hostname,
        port: Number(url.port),
        password: config.redis.pass,
    };
};

export const getBullRedisConfig = (config: AppConfigService): RedisOptions => {
    const redisConfig = getRedisStoreConfig(config);
    if ('clusterConfig' in redisConfig) {
        return redisConfig.clusterConfig.options.redisOptions;
    }
    return redisConfig;
};
