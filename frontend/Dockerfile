FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli

USER root

# Command to run will be overriden by docker-compose but we keep standard
CMD ["ng", "serve", "--host", "0.0.0.0"]
