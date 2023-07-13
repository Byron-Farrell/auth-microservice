# Base enviroment
FROM node:16-alpine AS base

RUN addgroup --system shield
RUN adduser --system --home /shield --ingroup shield shield-maiden

USER shield-maiden

WORKDIR /shield

RUN mkdir src

COPY package.json .
COPY package-lock.json .
COPY .env .


# Development enviroment
FROM base AS development

ENV NODE_ENV=development
RUN npm ci --save-dev

CMD ["npm", "run", "dev"]


# Production enviroment
FROM base AS production

ENV NODE_ENV=production

COPY src src/

RUN npm ci

CMD ["npm", "run", "prod"]



