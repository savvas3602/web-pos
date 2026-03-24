FROM postgres:latest

COPY create-schema.sql /docker-schema/create-schema.sql
COPY insert-initial-data.sql /docker-schema/insert-initial-data.sql
COPY init-db.sh /docker-entrypoint-initdb.d/init-db.sh

RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh
