# Base image
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build image
FROM base AS build
COPY . .

COPY prisma ./prisma

RUN npm run build

# Production image
FROM node:18 AS prod
WORKDIR /app

# Copy only the necessary files artifaces to ensure the finald ocker image is light weight
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma 
COPY --from=base /app/node_modules ./node_modules

COPY infra/docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Entry point will run db push + start. We need this for deployment in railway as the DATABASE_URL is only injected during runtime.
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/app.js"]
