import { describe, expect, it } from '@jest/globals';
import fastify, { FastifyReply } from 'fastify';
import ReplyWrapper from '../plugins/ReplyWrapper';

describe('Fastify Reply Wrapper', () => {
  it('should return 404 when route not found', async () => {
    const app = fastify();
    await app.register(ReplyWrapper);

    const response = await app.inject({
      method: 'GET',
      url: '/not-found',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should return 200 when route found', async () => {
    const app = fastify();
    await app.register(ReplyWrapper);

    app.get('/found', () => 'found');
    const response = await app.inject({
      method: 'GET',
      url: '/found',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('found');
  });

  it('should wrap response', async () => {
    const app = fastify();
    await app.register(ReplyWrapper);

    app.get('/found', (req, res: FastifyReply) => {
      res.send({ something: 'found' });
    });
    const response = await app.inject({
      method: 'GET',
      url: '/found',
    });

    expect(response.statusCode).toEqual(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('status', 'success');
    expect(body).toHaveProperty('code', 'SUCCESS');
    expect(body).toHaveProperty('data.something', 'found');
    expect(body).toHaveProperty('message', 'Berhasil.');
  });

  it('should wrap response 2', async () => {
    const app = fastify();
    await app.register(ReplyWrapper);

    app.get('/found', (req, res: FastifyReply) => {
      res.setApi({ code: 'CODE_A', message: 'Message A', status: 'success' });
      res.send({ something: 'found' });
    });
    const response = await app.inject({
      method: 'GET',
      url: '/found',
    });

    expect(response.statusCode).toEqual(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('status', 'success');
    expect(body).toHaveProperty('code', 'CODE_A');
    expect(body).toHaveProperty('data.something', 'found');
    expect(body).toHaveProperty('message', 'Message A');
  });

  it('should wrap response 3', async () => {
    const app = fastify();
    await app.register(ReplyWrapper);

    app.get('/found', (req, res: FastifyReply) => {
      res.setApi({ code: 'CODE_A', message: 'Message A', status: 'success' });
      res.send({ something: 'found' });
    });
    const response = await app.inject({
      method: 'GET',
      url: '/found',
    });

    expect(response.statusCode).toEqual(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('status', 'success');
    expect(body).toHaveProperty('code', 'CODE_A');
    expect(body).toHaveProperty('data.something', 'found');
    expect(body).toHaveProperty('message', 'Message A');
  });
});
