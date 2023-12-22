FROM --platform=linux/x86_64 nginx:1.25.3-alpine

WORKDIR /app

COPY ./ui/split-ui-spa/dist/split-ui-spa/browser /usr/share/nginx/html

COPY ./ui/split-ui-spa/nginx/default.conf /etc/nginx/conf.d

EXPOSE 80
