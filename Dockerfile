# --- 1. Base image
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- 2. Build image
FROM base AS build
COPY . .

# ✅ Copy the Prisma folder into the build context
COPY prisma ./prisma

RUN npm run build

# --- 3. Production image
FROM node:18 AS prod
WORKDIR /app

# Copy only the necessary artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma 
COPY --from=base /app/node_modules ./node_modules

COPY infra/docker/.env.prod .env
COPY infra/docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Entry point will run db push + start
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/app.js"]
