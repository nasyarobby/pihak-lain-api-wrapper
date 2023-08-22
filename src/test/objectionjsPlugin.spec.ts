import {
  describe, test, expect, jest,
} from '@jest/globals';
import fastify from 'fastify';

import mockKnex from 'mock-knex';
import objectionjsPlugin from '../plugins/objectionjs';

describe('objectionjsPlugin', () => {
  test('register correctly', async () => {
    jest.resetModules();
    const app = fastify();

    await app.register(
      objectionjsPlugin,
      {
        knexConfig: {
          client: 'oracledb',
        },
        models: [],
      },
    );

    mockKnex.mock(app.objection.knex);

    expect(app.objection).toBeDefined();
  });
  test('throw error', async () => {
    jest.resetModules();

    const app = fastify();
    try {
      await app.register(
        objectionjsPlugin,
        {
          knexConfig: {
            client: 'oracledb',
          },
          models: [new Date()],
        },
      );
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(((err as Error).message).endsWith('is not Subclass of ObjectionJS Model')).toBeTruthy();
    }
  });
});
