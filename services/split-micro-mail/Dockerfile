FROM --platform=linux/x86_64 node:lts

WORKDIR /app

# Copy project files, dependencies, and build directory
COPY ./package.json .
COPY ./yarn.lock .
COPY ./lerna.json .
COPY ./packages ./packages
COPY ./services/split-micro-mail ./services/split-micro-mail

RUN yarn install

RUN yarn lerna run --scope "@split-common/*" build
RUN yarn lerna run --scope "@split-micro/split-micro-mail" build

WORKDIR /app/services/split-micro-mail

# Expose port 3000
EXPOSE 3000

CMD ["yarn", "run-no-build"]
