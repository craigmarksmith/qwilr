FROM node:12.13.0-alpine

WORKDIR /usr/src/qwirl/interview

USER root
COPY . .
# RUN npm i

EXPOSE 3000