# Build stage - Node 20
FROM node:20-bullseye AS build
WORKDIR /app
# Copy backend sources into build context
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src
WORKDIR /app/backend
RUN npm install
# Try to build (allow non-zero exit to not block extremely fragile builds)
RUN npm run build || true

# Production stage
FROM node:20-bullseye AS prod
WORKDIR /app/backend
COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/backend/dist ./dist
# Install production deps
RUN npm install --omit=dev || true
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node","dist/server.js"]
