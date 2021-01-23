FROM node:15-alpine
WORKDIR /usr/src/app
COPY angular/ ./angular/
RUN cd angular && npm install @angular/cli && npm install && npm run build
COPY nodejs/ ./
RUN npm install
COPY nodejs/server.js ./

CMD ["node", "server.js"]