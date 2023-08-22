import { describe, test, expect } from '@jest/globals';
import fastify from 'fastify';
import ioredisMock from 'ioredis-mock';
import ioredisPlugin from '../plugins/ioredis';

describe('ioredisPlugin', () => {
  test('should host', async () => {
    const app = fastify();
    await app.register(ioredisPlugin, {
      confKey: 'redis',
      redisConfig: {
        REDIS_HOST: 'test01',
        REDIS_PORT: 6379,
        REDIS_PASS: 'password',
        REDIS_DB: 0,
      },
    });

    expect(app.redis).toBeInstanceOf(ioredisMock);
  });

  test('using sentinels', async () => {
    const app = fastify();
    await app.register(ioredisPlugin, {
      confKey: 'redis',
      redisConfig: {
        REDIS_SENTINEL: 'test01:26379,test02:26379,test03:26379',
        REDIS_PORT: 6379,
        REDIS_PASS: 'password',
        REDIS_DB: 0,
      },
    });

    expect(app.redis).toBeInstanceOf(ioredisMock);
  });

  test('using sentinels', async () => {
    const app = fastify();
    await app.register(ioredisPlugin, {
      confKey: 'redis',
      redisConfig: {
        REDIS_HOST: 'test2',
        REDIS_PORT: 6379,
        REDIS_PASS: 'password',
        REDIS_DB: 0,
      },
    });

    app.redis.emit('error');

    expect(app.redis).toBeInstanceOf(ioredisMock);
  });
});
