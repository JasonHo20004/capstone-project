#!/bin/sh
set -e

echo "Checking for failed migrations..."

# Resolve any failed migrations automatically
# Try to resolve known migrations that might have failed
for migration in 20251008152755_init 20251013094436_add_is_locked_to_notification_type 20251025145930_dev_1 20251125161859_ 20251127143426_add_is_email_verified; do
    if npx prisma migrate resolve --rolled-back "$migration" 2>/dev/null; then
        echo "Resolved failed migration: $migration"
    fi
done

# Deploy migrations
echo "Deploying migrations..."
npx prisma migrate deploy

# Start the server
echo "Starting server..."
exec node dist/server.js

