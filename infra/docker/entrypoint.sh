#!/bin/sh

# Fail if DATABASE_URL is not set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL is not set"
  exit 1
fi

echo "✅ DATABASE_URL is set"

echo "🧬 Running Prisma generate..."
npx prisma generate --schema=./prisma/schema.prisma

echo "🚀 Pushing schema to database..."
npx prisma db push --schema=./prisma/schema.prisma

echo "🚀 Starting app..."
exec "$@"
