import * as url from 'url';

import fastifySwagger from '@fastify/swagger';
import { FastifyInstance } from 'fastify';
import fastifySwaggerUi from '@fastify/swagger-ui';

const dirname = url.fileURLToPath(new URL('..', import.meta.url));

export default async function registerFastifySwagger(fastify: FastifyInstance) {
  await fastify.register(
    fastifySwagger,
    {
      mode: 'static',
      specification: {
        path: `${dirname}/openapi.json`,
        postProcessor(swaggerObject: any) {
          if (process.env.SWAGGER_HOSTS) {
            process.env.SWAGGER_HOSTS.split(',').forEach((host) => swaggerObject.servers.push({ url: host }));
          }
          return swaggerObject;
        },
        baseDir: '/',
      },
    },
  );

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest(request: any, reply: any, next: any) { next(); },
      preHandler(request:any, reply: any, next: any) { next(); },
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    // transformSpecification: (swaggerObject: any, request, reply) => { return swaggerObject },
    transformSpecificationClone: true,
  });
}
