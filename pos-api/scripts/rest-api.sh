#!/bin/bash
# rest-api.sh: Start and stop the POS REST API
# Usage: ./rest-api.sh [start|stop|status]

# Configurable locations for PID and log files
PID_FILE="${POS_API_PID_FILE:-/tmp/pos-rest-api.pid}"
LOG_DIR="${POS_API_LOG_DIR:-/tmp}"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
LOG_FILE="$LOG_DIR/pos-rest-api-$TIMESTAMP.log"

start_api() {
    JAR=$(find . -maxdepth 1 -type f -name 'web-pos-*.jar' | head -n 1)
    if [ -z "$JAR" ]; then
        echo "Rest API jar file named 'web-pos-*.jar' not found in current directory." >&2
        exit 1
    fi

    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "API is already running (PID $(cat "$PID_FILE"))."
        exit 1
    fi

    # Check if log directory is writable
    if [ ! -w "$LOG_DIR" ]; then
        echo "Log directory $LOG_DIR is not writable." >&2
        exit 1
    fi

    echo "Starting API..."
    nohup java -Dspring.profiles.active=dev -jar "$JAR" > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "API started (PID $!). Logs: $LOG_FILE"
}

stop_api() {
    if [ ! -f "$PID_FILE" ]; then
        echo "API is not running (no PID file)."
        exit 1
    fi

    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping API (PID $PID)..."
        kill "$PID"
        sleep 5

        if kill -0 "$PID" 2>/dev/null; then
            echo "API did not stop gracefully, killing..."
            kill -9 "$PID"
        fi
        echo "API stopped."
    else
        echo "No running process found for PID $PID. Removing stale PID file."
    fi
    rm -f "$PID_FILE"
}

status_api() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "API is running (PID $(cat "$PID_FILE"))."
    else
        echo "API is not running."
    fi
}

case "$1" in
    start)
        start_api
        ;;
    stop)
        stop_api
        ;;
    status)
        status_api
        ;;
    *)
        echo "Usage: $0 { start | stop | status }"
        exit 1
        ;;
esac
