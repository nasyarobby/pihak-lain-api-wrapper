// Adjust FastifyInstance interace at src/@types/fastify/index.d.ts
//
// declare module 'fastify' {
//     interface FastifyInstance {
//         config : {
//             ...... // your config matching schema
//         }
//     }
// }

const configSchema = {
  type: 'object',
  required: ['PORT', 'NODE_ENV', 'LOG_LEVEL'],
  properties: {
    HOST: {
      type: 'string',
      default: '0.0.0.0',
    },
    PORT: {
      type: 'number',
      default: 3000,
    },
    DB_DEBUG: {
      type: 'boolean',
      default: false,
    },
    NODE_ENV: {
      type: 'string',
      enum: ['development', 'production', 'test', 'local'],
      default: 'development',
    },
    LOG_LEVEL: {
      type: 'string',
      enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'trace',
    },
    REDIS_HOST: {
      type: 'string',
    },
    REDIS_DB: {
      type: 'number',
      default: 0,
    },
    REDIS_PORT: {
      type: 'number',
      default: 6379,
    },
    REDIS_SENTINEL_MASTER: {
      type: 'string',
    },
    REDIS_SENTINEL: {
      type: 'string',
    },
    REDIS_PASS: {
      type: 'string',
    },
    DB_CONNECT_STRING: {
      type: 'string',
    },
    DB_USER: {
      type: 'string',
    },
    DB_PASSWORD: {
      type: 'string',
    },
  },
};

export default configSchema;
