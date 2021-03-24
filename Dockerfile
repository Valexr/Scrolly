FROM node:15-alpine

COPY ./www/public /app
WORKDIR /app
RUN npm install -g derver

EXPOSE 8080

CMD ["derver","--production","--port=8080"]