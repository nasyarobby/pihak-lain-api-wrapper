import {
  FastifyPluginCallback, FastifyReply, FastifyRequest,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import ServerError from './ServerError.js';

const ALLOW_EMPTY_API_CODE = true;

type DjpapiReplyWrapper = FastifyPluginCallback<ReplyWrapperNS.ReplyWrapperOptions>;

declare namespace ReplyWrapperNS {
  interface ReplyWrapperOptions {
    confKey: string
  }
}

function replyWrapper(...[fastify, opts, pluginCb] : Parameters<DjpapiReplyWrapper>) {
  try {
    const confKey = opts.confKey || 'setApi';

    fastify.decorateReply<(
    code: { status: string, code: string, message: string }) => any>(
      confKey,
      function setApi(apiObj: { status?: string, code: string, message: string }) {
        this.api = { ...apiObj, status: apiObj.status || 'success' };
        return this;
      },
      );

    fastify.addHook('preSerialization', (request: FastifyRequest, reply: FastifyReply, payload: any, done:any) => {
      const err = null;

      // this is the OpenAPI Schema, so we don't need to wrap it
      if (reply.statusCode === 404 || (payload && payload.openapi)) {
        return done(err, payload);
      }

      if (reply.api) {
        const newPayload = {
          ...reply.api,
          data: payload,
        };
        return done(err, newPayload);
      }

      if (ALLOW_EMPTY_API_CODE) {
        return done(err, {
          status: 'success', code: 'SUCCESS', message: 'Berhasil.', data: payload,
        });
      }

      throw new ServerError({
        code: 'MISSING_API_CODE',
        message: 'Missing api code. Did you called reply.apiCode before send?',
        data: payload,
      });
    });

    pluginCb();
  } catch (err) {
    pluginCb(err as Error);
  }
}

export default fastifyPlugin(replyWrapper, {
  fastify: '4.x',
  name: 'replyWrapper',
});
