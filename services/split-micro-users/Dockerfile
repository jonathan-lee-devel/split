# Start production image build
FROM --platform=linux/x86_64 node:lts

WORKDIR /app

# Copy node modules and build directory
COPY ./node_modules ./node_modules
COPY ./services/split-micro-users ./split-micro-users

# Expose port 3000
EXPOSE 3000
CMD ["split-micro-users/dist/server.js"]
