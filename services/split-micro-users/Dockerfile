# Start production image build
FROM --platform=linux/x86_64 node:lts

WORKDIR /app

# Copy node modules and build directory
COPY ./services/split-micro-users/dist /app/dist
COPY ./node_modules /app/node_modules

# Expose port 3000
EXPOSE 3000
CMD ["dist/server.js"]
