FROM postgres:latest
COPY create_schema.sql /docker-schema/create_schema.sql
COPY init-schema.sh /docker-entrypoint-initdb.d/init-schema.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-schema.sh
