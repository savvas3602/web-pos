#!/bin/bash

set -e

if [ "${POSTGRES_CREATE_SCHEMA}" = "true" ]; then
    echo "POSTGRES_CREATE_SCHEMA=true → Running create_schema.sql..."
    psql -v ON_ERROR_STOP=1 \
      --username "$POSTGRES_USER" \
      --dbname "$POSTGRES_DB" \
      -f /docker-schema/create-schema.sql
else
    echo "POSTGRES_CREATE_SCHEMA=${POSTGRES_CREATE_SCHEMA} → Skipping schema creation."
fi

if [ "${POSTGRES_INSERT_INITIAL_DATA}" = "true" ]; then
    echo "POSTGRES_INSERT_INITIAL_DATA=true -> Running insert-initial-data.sql..."
    psql -v ON_ERROR_STOP=1 \
      --username "$POSTGRES_USER" \
      --dbname "$POSTGRES_DB" \
      -f /docker-schema/insert-initial-data.sql
else
    echo "POSTGRES_INSERT_INITIAL_DATA=${POSTGRES_INSERT_INITIAL_DATA} -> Skipping initial data insert."
fi
