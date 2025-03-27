#!/bin/sh



echo "🧬 Running Prisma generate..."
npx prisma generate --schema=./prisma/schema.prisma

echo "🚀 Pushing schema to database..."
npx prisma db push --schema=./prisma/schema.prisma

echo "🚀 Starting app..."
exec "$@"
