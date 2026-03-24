#!/bin/bash

set -e

if [ "${POSTGRES_CREATE_SCHEMA}" = "true" ]; then
    echo "POSTGRES_CREATE_SCHEMA=true → Running create_schema.sql..."
    psql -v ON_ERROR_STOP=1 \
      --username "$POSTGRES_USER" \
      --dbname "$POSTGRES_DB" \
      -f /docker-schema/create_schema.sql
else
    echo "POSTGRES_CREATE_SCHEMA=${POSTGRES_CREATE_SCHEMA} → Skipping schema creation."
fi