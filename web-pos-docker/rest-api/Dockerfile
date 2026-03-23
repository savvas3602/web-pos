# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /build

# Copy Maven wrapper and project descriptor first for better layer caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Download dependencies (cached unless pom.xml changes)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build the JAR, skipping tests
COPY src ./src
RUN ./mvnw package -DskipTests -DskipAssembly -B

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jdk

WORKDIR /app
COPY --from=builder /build/target/pos-api-0.0.1-SNAPSHOT.jar rest-api.jar

ENTRYPOINT ["java", "-jar", "rest-api.jar"]