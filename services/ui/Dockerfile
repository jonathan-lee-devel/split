FROM --platform=linux/x86_64 node:lts as build

WORKDIR /app

COPY package.json /app

RUN yarn install

COPY . /app

RUN yarn run build:prod

FROM --platform=linux/x86_64 nginx:1.25.3-alpine3.18

COPY --from=build app/dist/split-ui /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
