#!/bin/sh
set -e

echo "Starting application..."

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Create/update admin user automatically
echo "Setting up admin user..."
node scripts/setup-admin.js || echo "Warning: Admin setup failed, but continuing..."

# Start the application
echo "Starting Next.js server..."
exec node server.js
