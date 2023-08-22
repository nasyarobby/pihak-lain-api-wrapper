import { FastifyError, FastifyInstance } from 'fastify';
import ApiError from './ApiError.js';

type ErrorHandler = Parameters<FastifyInstance['setErrorHandler']>[0];
type SetErrorHandlerParams = Parameters<ErrorHandler>;

const errorHandler:ErrorHandler = function errorHandler(
  ...[error, request, reply]: SetErrorHandlerParams
) {
  if (error instanceof ApiError) {
    // Log error
    this.log.error(error);
    // Send error response
    return reply
      .setApi({ message: error.message, status: error.status, code: error.code })
      .send({ ...error.data, error: error.originalError });
  }

  const fastifyError = error as FastifyError;

  if (error.message.startsWith('ORA-')) {
    return reply
      .setApi({
        status: 'error',
        code: 'ERR_DB',
        message: `Terdapat kesalahan pada sistem (${error.message.split(':')[0].toUpperCase()}).`,
      })
      .send({
        error: {
          message: error.message,
          stack: error.stack,
          code: fastifyError.code === undefined ? '500' : fastifyError.code,
        },
      });
  }

  return reply
    .setApi({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unknown error has occured.',
    })
    .send({
      error: {
        message: error.message,
        stack: error.stack,
        code: fastifyError.code === undefined ? '500' : fastifyError.code,
      },
    });
};

export default errorHandler;
