FROM node:12.13.0-alpine

WORKDIR /usr/src/qwirl/interview

USER root
COPY . .

EXPOSE 3000