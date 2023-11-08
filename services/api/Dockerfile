FROM --platform=linux/x86_64 node:lts as build

# Add package file
COPY package.json ./
COPY yarn.lock ./

# Add custom types
COPY @types ./

# Install deps
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN yarn build

# Start production image build
FROM --platform=linux/x86_64 node:lts as build

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist

# Expose port 3000
EXPOSE 3000
CMD ["dist/server.js"]
