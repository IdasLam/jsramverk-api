FROM node:alpine

WORKDIR /api

COPY package*.json ./
COPY src ./

RUN npm install -g nodemon
RUN npm i -g ts-node
RUN npm i

ENTRYPOINT npm run start