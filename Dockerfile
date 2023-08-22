FROM node:16.19.0-alpine as builder

WORKDIR /server

# Install dependencies, taking benefits from Docker caching capabilities
# If no change to the dependencies, Docker will use the cached layer
COPY ./package.json yarn.lock tsconfig.json* ./
ADD ./compile.sh ./
RUN yarn install --production=false

# Copy the rest of the files, and compile
COPY . .
RUN yarn run compile

FROM node:16.19.0-alpine

WORKDIR /server
RUN yarn global add pm2

# Here is also the same, before copying the built result, we copy the package.json
# Copying built files heredo, will invalidate the cache, and will force to re-install
# this layer will always the same (cached) if no changes to deps
COPY package.json yarn.lock ./
ADD ./compile.sh ./
RUN yarn install --production=true --ignore-engines

# Now copy the built files
COPY --from=builder /server/build ./
CMD [ "pm2-runtime", "start", "server.js"]
