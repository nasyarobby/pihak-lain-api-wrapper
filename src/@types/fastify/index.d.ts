import Redis from 'ioredis';
import { Knex } from 'knex';
import models from '../../models/index.js';
import { redisCache } from '../../plugins/RedisCache.js';

type Config = {
  LOG_LEVEL: string;
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  REDIS_SENTINEL?: string;
  DEBUG_DB: boolean;
  REDIS_SENTINEL_MASTER?: string;
  REDIS_PASS?: string;
  REDIS_DB?: number;
  REDIS_PORT?: number;
  REDIS_HOST?: string;
  DB_CONNECT_STRING?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
};

declare module 'fastify' {
  export declare namespace fastifyObjectionjs {
    export interface FastifyObjectionObject {
      knex: Knex
      models: typeof models
    }
  }

  interface FastifyInstance {
    config: Config
    objection: fastifyObjectionjs.FastifyObjectionObject
    redis: Redis
    cache: typeof redisCache
  }

  export interface FastifyRequest {
  }

  export interface FastifyReply {
    setApi: (apiObj:{
      status?: string,
      code: string, message: string,
    }) => FastifyReply;
    api: {
      message: string;
      code: string;
      status: string;
    };
  }
}
