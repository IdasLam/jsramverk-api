FROM node:alpine

WORKDIR /api

COPY package*.json ./
COPY src ./

RUN npm i

ENTRYPOINT npm run start