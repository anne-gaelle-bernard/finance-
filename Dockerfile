# ── Build stage ──
FROM node:18-alpine AS build

WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev

# ── Runtime stage ──
FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

# Copy installed node_modules from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy backend source code
COPY backend/ ./

EXPOSE 5000

CMD ["node", "server.js"]
