FROM --platform=linux/x86_64 node:lts as build

WORKDIR /app

COPY package.json /app

RUN yarn install

COPY . /app

RUN yarn run build:prod

# Start production image build
FROM --platform=linux/x86_64 node:lts

# Copy dist directory
COPY --from=build /app/dist /dist

# Expose port 4000
EXPOSE 4000

CMD ["dist/ui-ssr/server/server.mjs"]
