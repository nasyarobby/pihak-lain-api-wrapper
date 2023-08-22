import * as url from 'url';

import { FastifyInstance } from 'fastify';
import fastifyOpenapiGlue from 'fastify-openapi-glue';

const dirname = url.fileURLToPath(new URL('..', import.meta.url));

export default function registerFastifyOpenApiGlue(
  fastify: FastifyInstance,
  service: any,
) {
  fastify.register(fastifyOpenapiGlue, {
    specification: `${dirname}/openapi.json`,
    service,
    prefix: '/api',
  });
}
