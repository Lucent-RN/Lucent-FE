# Stage 1: Build
FROM node:22.15.1 AS builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps --force

# Copy rest of source
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production
FROM node:22.15.1-alpine
WORKDIR /app

# Copy only necessary artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]