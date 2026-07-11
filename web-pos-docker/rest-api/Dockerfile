# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /build

COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Download dependencies (cached unless pom.xml changes)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw package -DskipTests -Dassembly.skipAssembly=true -B

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre

RUN apt-get update  \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system spring \
    && useradd --system --gid spring --no-create-home --shell /usr/sbin/nologin spring

WORKDIR /app
COPY --from=builder /build/target/pos-api-0.0.1-SNAPSHOT.jar rest-api.jar
COPY --from=dockerfiles entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

ENV REST_API_PORT=8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${REST_API_PORT}/actuator/health || exit 1

# Image starts as root so the entrypoint can fix bind-mount ownership, then
# setpriv drops to the unprivileged "spring" user before java ever runs.
ENTRYPOINT ["./entrypoint.sh"]