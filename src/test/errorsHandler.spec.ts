import { describe, expect, it } from '@jest/globals';
import fastify from 'fastify';
import ClientError from '../plugins/ClientError';
import errorHandler from '../plugins/errorHandler';
import notFoundHandler from '../plugins/notFoundHandler';
import ReplyWrapper from '../plugins/ReplyWrapper';
import ServerError from '../plugins/ServerError';

describe('Fastify Error Handler', () => {
  it('should return 404 when route not found', async () => {
    const app = fastify();
    app.setNotFoundHandler(notFoundHandler);
    await app.register(ReplyWrapper);

    const response = await app.inject({
      method: 'GET',
      url: '/not-found',
    });
    expect(response.statusCode).toEqual(404);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('message', 'GET /not-found cannot be found');
  });

  it('should return ERROR_DB when route not found', async () => {
    const app = fastify();
    app.setErrorHandler(errorHandler);
    await app.register(ReplyWrapper);
    app.get('/error', () => {
      throw new Error('ORA-00942: table or view does not exist');
    });

    const response = await app.inject({
      method: 'GET',
      url: '/error',
    });
    expect(JSON.parse(response.body)).toHaveProperty('status', 'error');
    expect(JSON.parse(response.body)).toHaveProperty('code', 'ERR_DB');
    expect(JSON.parse(response.body)).toHaveProperty('data');
    expect(JSON.parse(response.body)).toHaveProperty('data.error');
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Terdapat kesalahan pada sistem (ORA-00942).');
  });

  it('should return fails when ClientError is thrown', async () => {
    const app = fastify();
    app.setErrorHandler(errorHandler);
    await app.register(ReplyWrapper);
    app.get('/error', () => {
      throw new ClientError({
        code: '400', message: 'Bad Request', data: { foo: 'bar' }, originalError: new Error('Original Error'),
      });
    });

    const response = await app.inject({
      method: 'GET',
      url: '/error',
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toHaveProperty('status', 'fail');
    expect(JSON.parse(response.body)).toHaveProperty('code', '400');
  });

  it('should return error when ServerError is thrown', async () => {
    const app = fastify();
    app.setErrorHandler(errorHandler);
    await app.register(ReplyWrapper);
    app.get('/error', () => {
      throw new ServerError({
        code: '500', message: 'Server has trouble', data: { foo: 'bar' }, originalError: new Error('Original Error'),
      });
    });

    const response = await app.inject({
      method: 'GET',
      url: '/error',
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toHaveProperty('status', 'error');
    expect(JSON.parse(response.body)).toHaveProperty('code', '500');
  });

  it('should return error when Error is thrown', async () => {
    const app = fastify();
    app.setErrorHandler(errorHandler);
    await app.register(ReplyWrapper);
    app.get('/error', () => {
      throw new Error('Some error');
    });

    const response = await app.inject({
      method: 'GET',
      url: '/error',
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toHaveProperty('status', 'error');
    expect(JSON.parse(response.body)).toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
  });
});
