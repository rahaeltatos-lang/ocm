# Multi-stage build for API
FROM node:18-alpine AS api-builder
WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci
COPY api/src ./src
COPY api/tsconfig.json ./
RUN npm run build

# API runtime
FROM node:18-alpine AS api
WORKDIR /app
COPY --from=api-builder /app/api/dist ./dist
COPY --from=api-builder /app/api/package*.json ./
RUN npm ci --only=production
EXPOSE 4001
CMD ["node", "dist/index.js"]

# Next.js build for web
FROM node:18-alpine AS web-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Web runtime
FROM node:18-alpine AS web
WORKDIR /app
COPY --from=web-builder /app/web/.next ./.next
COPY --from=web-builder /app/web/public ./public
COPY --from=web-builder /app/web/package*.json ./
RUN npm ci --only=production
EXPOSE 3001
CMD ["npm", "start"]
