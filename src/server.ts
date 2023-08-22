import fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyOpenapiGlue from 'fastify-openapi-glue';
import * as url from 'url';
import { knexSnakeCaseMappers } from 'objection';
import registerFastifySwagger from './plugins/registerFastifySwagger.js';
import replyWrapperPlugin from './plugins/ReplyWrapper.js';
import configSchema from './config.js';
import ioredisPlugin from './plugins/ioredis.js';
import errorHandler from './plugins/errorHandler.js';
import notFoundHandler from './plugins/notFoundHandler.js';
import getService from './services/index.js';
import objectionjs from './plugins/objectionjs.js';
import Models from './models/index.js';
import RedisCache from './plugins/RedisCache.js';

async function start() {
  const app = fastify({ logger: true });

  /**
 * Custom Error handler
 */
  app.setErrorHandler(errorHandler);

  app.setNotFoundHandler(notFoundHandler);

  /**
 * Plugin: ReplyWrapper
 */
  await app.register(replyWrapperPlugin);

  /**
 * Plugin: Swagger UI
 * Halaman dapat diakses pada /documentation
 */
  await registerFastifySwagger(app);

  /**
 * Plugin: @fastify/env
 * cek file {@link ./config.ts}
 */
  await app.register(fastifyEnv, {
    schema: configSchema,
  });

  // eslint-disable-next-line no-console
  console.table(app.config);

  await app.register(objectionjs, {
    knexConfig: {
      client: 'oracledb',
      connection: {
        connectString: app.config.DB_CONNECT_STRING,
        user: app.config.DB_USER,
        password: app.config.DB_PASSWORD,
      },
      ...knexSnakeCaseMappers({
        upperCase: true,
      }),
      debug: app.config.DEBUG_DB,
    },
    models: Models,
  });

  /**
 * Plugin: IORedis {@file ./plugins/ioredis.ts}
 * akses via req.redis
 * NOTES: Remember to always await (or then/catch) redis command
 * or else Fastify will crash
 */
  await app.register(ioredisPlugin, { confKey: 'redis', redisConfig: app.config });

  await app.register(RedisCache, { redis: app.redis, db: 5, ttl: 5 });

  /**
 * Plugin: fastify-openapi-glue
 * Spek API disimpan pada file openapi.json
 */
  const dirname = url.fileURLToPath(new URL('.', import.meta.url));
  await app.register(fastifyOpenapiGlue, {
    specification: `${dirname}/openapi.json`,
    service: getService(app),
    prefix: '/api',
  });

  app.ready((errorOnAppReady) => {
    app.log.level = app.config.LOG_LEVEL;
    app.log.info('Ready');

    if (errorOnAppReady) {
      app.log.error(errorOnAppReady);
      process.exit(1);
    }

    app.listen({
      host: app.config.HOST,
      port: app.config.PORT,
    }, (err) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    });
  });
}

start();
