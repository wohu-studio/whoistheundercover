FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package.json ./
COPY shared/ ./shared/
COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/

# Install all dependencies (including devDeps for build)
RUN cd backend && npm ci && cd ../frontend && npm ci

# Copy source
COPY docs/ ./docs/
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build
RUN npm run build

# Copy shared compiled output to shared root so require("../../../shared/events") resolves
RUN cp -r /app/shared/dist/* /app/shared/

# Production image
FROM node:20-slim

WORKDIR /app

COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/package.json ./backend/
COPY --from=build /app/frontend/dist ./frontend/dist
COPY --from=build /app/shared ./shared
COPY --from=build /app/docs ./docs
COPY --from=build /app/package.json ./

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["npm", "start"]
