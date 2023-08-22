import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const getConfig = (fastify: FastifyInstance) => ((req: FastifyRequest, res: FastifyReply) => {
  res.setApi({
    status: 'success',
    code: 'SUCCESS_GET_CONFIG',
    message: 'Berhasil mendapatkan konfigurasi',
  }).send({ config: fastify.config });
});

export default getConfig;
