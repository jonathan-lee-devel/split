# Start production image build
FROM --platform=linux/x86_64 node:lts

WORKDIR /app

# Copy node modules and build directory
COPY ./ui/split-ui/dist /app/dist
COPY ./node_modules /app/node_modules

# Expose port 4000
EXPOSE 4000
CMD ["dist/split-ui/server/server.mjs"]
