# ----------------------------
# Build Stage
# ----------------------------
FROM node:20 AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . ./

# Build the TypeScript project
RUN npm run build


# ----------------------------
# Runtime Stage
# ----------------------------
FROM node:20-slim

WORKDIR /app

# Copy production files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the app port
EXPOSE 5000

# Start the server using the compiled JS file
CMD ["node", "dist/server.js"]
