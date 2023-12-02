FROM --platform=linux/x86_64 node:lts

WORKDIR /app

# Copy project files, dependencies, and build directory
COPY ./package.json .
COPY ./yarn.lock .
COPY ./lerna.json .
COPY ./packages/split-env/ ./packages/split-env
COPY ./packages/split-constants/ ./packages/split-constants
COPY ./packages/split-auth/ ./packages/split-auth
COPY ./packages/split-observability/ ./packages/split-observability
COPY ./packages/split-service-config ./packages/split-service-config
COPY ./packages/split-http ./packages/split-http
COPY ./packages/split-mail ./packages/split-mail
COPY ./services/split-micro-users ./services/split-micro-users

RUN yarn install

RUN yarn lerna run --scope '{@split/split-constants,@split/split-auth,@split/split-observability,@split/split-micro-users}' build

WORKDIR /app/services/split-micro-users

# Expose port 3000
EXPOSE 3000

CMD ["yarn", "run-no-build"]
