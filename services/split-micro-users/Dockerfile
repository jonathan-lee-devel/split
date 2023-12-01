# Start production image build
FROM --platform=linux/x86_64 node:lts

WORKDIR /app

# Copy node modules, dependencies, and build directory
COPY ./node_modules ./node_modules
COPY ./services/split-micro-users ./split-micro-users
COPY ./packages/split-constants/dist/* ./split-micro-users/dist

# Expose port 3000
EXPOSE 3000
CMD ["split-micro-users/dist/server.js"]
