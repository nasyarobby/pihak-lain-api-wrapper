import { FastifyReply, FastifyRequest } from 'fastify';

// const preHandler = {
//   preValidation: (req, reply, done) => {
//     // your code
//     done();
//   },
//   preHandler: (req, reply, done) => {
//     // your code
//     done();
//   },
// };

export default function notFoundHandler(request:FastifyRequest, reply:FastifyReply) {
  reply
    .status(404)
    .send({
      status: 'error',
      code: 'NOT_FOUND',
      message: `${request.method} ${request.url} cannot be found`,
      data: { method: request.method, path: request.url },
    });
}
