import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import Redis from 'ioredis';

type RedisCache = FastifyPluginCallback<RedisCacheNs.RedisCacheOptions>;

declare namespace RedisCacheNs {
  interface RedisCacheOptions {
    redis: Redis;
    db: number;
    ttl?: number;
  }
}

type RedisCacheSetupOptions<T> = {
  key: string;
  data: () => Promise<T>;
  ttl?: number;
};

type RedisCacheStorage<T> = {
  get: () => Promise<T>;
  sourceThenCache: () => Promise<T>;
};

type RedisCacheT = {
  setup: <T>(opts: RedisCacheSetupOptions<T>) => RedisCacheStorage<T>;
};

export function redisCacheWrapper(redis: Redis, ttl: number): RedisCacheT {
  return {
    setup: function setup<T>(opts: RedisCacheSetupOptions<T>) {
      return {
        get: async () => {
          const cached = await redis.get(opts.key);
          if (cached) {
            return JSON.parse(cached);
          }
          const data = await opts.data();
          redis.set(opts.key, JSON.stringify(data), 'EX', opts.ttl === undefined ? ttl : opts.ttl);
          return data;
        },
        sourceThenCache: async () => {
          const data = await opts.data();
          redis.set(opts.key, JSON.stringify(data), 'EX', opts.ttl === undefined ? ttl : opts.ttl);
          return data;
        },
      };
    },
  };
}

function redisCacheFastifyPlugin(...[fastify, opts, done] : Parameters<RedisCache>) {
  try {
    let redis: Redis;
    if (opts.db) {
      redis = opts.redis.duplicate();
      redis.select(opts.db);
    } else {
      redis = opts.redis;
    }

    fastify.decorate('cache', redisCacheWrapper(redis, opts?.ttl === undefined ? -1 : opts.ttl));

    done();
  } catch (err) {
    done(err as Error);
  }
}

export default fastifyPlugin(redisCacheFastifyPlugin, {
  fastify: '4.x',
  name: 'RedisCachePlugin',
});
