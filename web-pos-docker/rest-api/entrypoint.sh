#!/bin/sh
set -e

# Runs as root only to fix up bind-mounted volume ownership (Docker creates
# missing bind-mount host dirs as root:root), then drops to the unprivileged
# "spring" user before the app itself ever runs.
mkdir -p /app/logs
chown -R spring:spring /app/logs

exec setpriv --reuid=spring --regid=spring --init-groups java -jar rest-api.jar
