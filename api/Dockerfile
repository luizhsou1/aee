############################################
### API BUILD STAGE
############################################
FROM node:16.14-alpine AS build-stage
WORKDIR /api
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Install only production dependencies
RUN rm -rf node_modules && npm ci --production

############################################
### IMAGE BUILD STAGE
############################################
FROM node:16.13-alpine
WORKDIR /api
RUN apk --no-cache add curl
COPY --from=build-stage /api/node_modules ./node_modules
COPY --from=build-stage /api/dist ./dist
COPY public ./public
COPY package.json ./
COPY ormconfig.js ./
COPY .env.sample .env
EXPOSE  4000
CMD [ "npm", "start" ]
