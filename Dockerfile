FROM node:latest

RUN apt-get update && apt-get clean
CMD ['npm','run','start']
EXPOSE 4020
