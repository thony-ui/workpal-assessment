#!/bin/sh

# Run Prisma commands before starting the app
echo "⏳ Running Prisma generate..."
npx prisma generate

echo "🚀 Pushing schema to DB..."
npx prisma db push

echo "✅ Starting app..."
exec "$@"