import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import ClientError from '../plugins/ClientError.js';
import ServerError from '../plugins/ServerError.js';
import getConfig from './getConfig.js';

import RESPONSE_CODES from '../responseCodes/responseCodes.js';

export default function getService(fastify:FastifyInstance) {
  return {
    getRoot: async (req: FastifyRequest, res: FastifyReply) => {
      // simple response
      // the following line will crash Fastify because no await
      // fastify.redis.set('time', new Date().toISOString());
      // this will not crash Fastify
      await fastify.redis.set('time', new Date().toISOString());

      const time = await fastify.redis.get('time');
      res.setApi(RESPONSE_CODES.SUCCESS).send({ foo: 'bar', time });
    },

    getGoodById: async (req: FastifyRequest & { params: { id: string } }, res: FastifyReply) => {
      const good = await fastify.objection.models.GoodsModel.query().where('id', req.params.id).debug();
      res.setApi(RESPONSE_CODES.SUCCESS).send({ good });
    },

    getRootPlain: (req: FastifyRequest, res: FastifyReply) => {
      res.send({ foo: 'bar' });
    },

    getClientError: (req: FastifyRequest, res: FastifyReply) => {
      throw new ClientError({
        ...RESPONSE_CODES.CLIENT_ERROR,
        data: { foo: 'bar' },
        originalError: new Error('Error client'),
      });
    },

    getServerError: (req: FastifyRequest, res: FastifyReply) => {
      throw new ServerError({
        ...RESPONSE_CODES.SERVER_ERROR,
        data: { foo: 'bar' },
        originalError: new Error('Error Server'),
      });
    },

    getUnknownError: (req: FastifyRequest, res: FastifyReply) => {
      throw new Error('Unknown error');
    },

    getConfig: getConfig(fastify),

    getCache: async (req: FastifyRequest, res: FastifyReply) => {
      const data = await fastify.cache.setup({
        key: 'test',
        ttl: 10, // 10 seconds
        data: async () => {
          const time = new Date().toISOString();
          return { time };
        },
      }).get();
      res.setApi(RESPONSE_CODES.SUCCESS).send({ data });
    },
  };
}
