import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import Knex, { Knex as KnexNs } from 'knex';
import { Model } from 'objection';

type ObjectionJsFastify = FastifyPluginCallback<ObjectionJsFastifyNs.ObjectionJsFastifyOptions>;

declare namespace ObjectionJsFastifyNs {
  interface ObjectionJsFastifyOptions {
    knexConfig: KnexNs.Config,
    models: { [key: string]: any }
  }
}

function redisFastifyPlugin(...[fastify, opts, done] : Parameters<ObjectionJsFastify>) {
  try {
    const knexConnection = Knex(opts.knexConfig);
    Model.knex(knexConnection);

    Object.keys(opts.models).forEach((k) => {
      if (!(opts.models[k].prototype instanceof Model)) { throw Error(`${k} is not Subclass of ObjectionJS Model`); }
    });

    fastify.decorate('objection', { knex: knexConnection, models: opts.models });

    done();
  } catch (err) {
    done(err as Error);
  }
}

export default fastifyPlugin(redisFastifyPlugin, {
  fastify: '4.x',
  name: 'objectionjsPlugin',
});
