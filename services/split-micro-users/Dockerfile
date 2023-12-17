FROM --platform=linux/x86_64 node:21.3-bullseye-slim

WORKDIR /app

# Copy project files, dependencies, and build directory
COPY ./package.json .
COPY ./yarn.lock .
COPY ./lerna.json .
COPY ./packages ./packages
COPY ./services/split-micro-users ./services/split-micro-users

RUN yarn install

RUN yarn lerna run --scope "@split-common/*" build
RUN yarn lerna run --scope "@split-micro/split-micro-users" build

WORKDIR /app/services/split-micro-users

# Expose port 3000
EXPOSE 3000

CMD ["yarn", "run-no-build"]
