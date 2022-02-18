############################################
### API BUILD STAGE
############################################
FROM node:16.13-alpine AS apibuild

# Create api directory
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

# Install api dependencies
COPY package.json package-lock.json /usr/src/api/
RUN npm ci

# Build api
COPY tsconfig.json ormconfig.js /usr/src/api/
COPY src /usr/src/api/src
RUN npm run build

# Install api production dependencies
RUN rm -rf node_modules && npm ci --production

############################################
### IMAGE BUILD STAGE
############################################
FROM node:16.13-alpine

# Create api directory
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

# Copy api dependencies
COPY package.json /usr/src/api/
COPY --from=apibuild /usr/src/api/node_modules /usr/src/api/node_modules

# Bundle api source
COPY --from=apibuild /usr/src/api/dist /usr/src/api/dist
COPY .env.sample .env
COPY public /usr/src/api/public
COPY ormconfig.js /usr/src/api/

EXPOSE  3030

CMD [ "npm", "start" ]
