# Dockerfile

# --- 1. Base image
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- 2. Build image
FROM base AS build
COPY . .
RUN npm run build

# --- 3. Production image
FROM node:18 AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY infra/docker/.env.prod .env
CMD ["node", "dist/app.js"]
