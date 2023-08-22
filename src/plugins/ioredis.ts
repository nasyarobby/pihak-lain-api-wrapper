import Redis from 'ioredis';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Config } from '../@types/fastify';

type IORedisFastify = FastifyPluginCallback<ioredisFastify.IORedisFastifyOptions>;
type RedisConfig = Pick<Config, 'REDIS_SENTINEL' | 'REDIS_DB' | 'REDIS_HOST' | 'REDIS_PASS' | 'REDIS_PORT' | 'REDIS_SENTINEL_MASTER'>;

declare namespace ioredisFastify {
  interface IORedisFastifyOptions {
    confKey: string,
    redisConfig: RedisConfig,
  }
}

const parseRedisSentinel = (str: string) => str
  .split(',')
  .map((sentinelString) => sentinelString.trim())
  .map((sentinelString) => sentinelString.split(':'))
  .map(([host, port]) => ({ host, port: Number(port) || 26379 }));

export const createClientSentinel = (config: Config) => {
  const {
    REDIS_SENTINEL, REDIS_SENTINEL_MASTER, REDIS_PASS, REDIS_DB,
  } = config;
  const sentinels = REDIS_SENTINEL ? parseRedisSentinel(REDIS_SENTINEL) : [];

  return new Redis({
    sentinels,
    name: REDIS_SENTINEL_MASTER,
    password: REDIS_PASS,
    db: REDIS_DB,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};

function createRedisClient(config: RedisConfig) {
  return config.REDIS_SENTINEL
    ? new Redis({
      sentinels: parseRedisSentinel(config.REDIS_SENTINEL),
      name: config.REDIS_SENTINEL_MASTER,
      password: config.REDIS_PASS,
      db: config.REDIS_DB || 0,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
    : new Redis({
      port: config.REDIS_PORT,
      host: config.REDIS_HOST,
      password: config.REDIS_PASS,
      db: config.REDIS_DB,
    });
}

function redisFastifyPlugin(...[fastify, opts, done] : Parameters<IORedisFastify>) {
  try {
    const confKey = opts.confKey || 'redis';
    const client = createRedisClient(opts.redisConfig);

    client.on('ready', () => {
      fastify.log.info('Connected to redis');
      if (opts.redisConfig.REDIS_SENTINEL) {
        fastify.log.info({ sentinels: parseRedisSentinel(opts.redisConfig.REDIS_SENTINEL) }, 'Redis Sentinel Mode');
      }
    });

    client.on('error', (error) => {
      fastify.log.error({ err: error }, 'Redis Error');
    });

    fastify.decorate(confKey, client);
    done();
  } catch (err) {
    done(err as Error);
  }
}

export default fp(redisFastifyPlugin, {
  fastify: '4.x',
  name: 'redisFastifyPlugin',
});
