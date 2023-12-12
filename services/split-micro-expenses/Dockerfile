FROM --platform=linux/x86_64 node:lts

WORKDIR /app

# Copy project files, dependencies, and build directory
COPY ./package.json .
COPY ./yarn.lock .
COPY ./lerna.json .
COPY ./packages ./packages
COPY ./services/split-micro-expenses ./services/split-micro-expenses

RUN yarn install

RUN yarn lerna run --scope "@split-common/*" build
RUN yarn lerna run --scope "@split-micro/split-micro-expenses" build

WORKDIR /app/services/split-micro-expenses

# Expose port 3000
EXPOSE 3000

CMD ["yarn", "run-no-build"]
