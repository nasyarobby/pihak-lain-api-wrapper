# Fastify Skeleton V2

This is a github template for API Service, built with:

- Typescript
- Fastify 4
- Knex & ObjectionJS
- IORedis
- Spec-first-approach using OpenAPI/Swagger 
- Env variables using .env for development
- Develop inside container with hot reload

## Developing Your API Using Docker

1. Create your own repo using this template
2. Clone to your development machine
3. Run ```yarn```
4. Start development by running ```yarn docker-dev```. The example app will run on http://localhost:3000 (Swagger-UI is available)
5. Edit and the code will recompile between changes.

        You also can run the development server without docker using ```yarn dev```

## Debugging in VS Code
1. In VS Code, open Run and Debug (Ctrl+Shif+D)
2. Launch Fastify Server
3. Set breakpoints and stuffs

## Fastify Decorations

### Fastify Instance

1. App Config (```FastifyInstance.config```)
2. IORedis (```FastifyInstance.redis```)
3. Knex (```FastifyInstance.objectionjs.knex```)
4. ObjectionsJS Models (```FastifyInstance.objectionjs.models.YourModels```)

### Fastify Reply
1. ReplyWrapper (```FastifyReply.setApi({code: string, message: string, data: object, status: string})```)