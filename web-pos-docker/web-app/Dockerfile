# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Vite only exposes env-vars prefixed with VITE_ to the browser bundle.
# Pass the API base URL at build time so it is baked into the static assets.
ARG VITE_REST_API_URL=http://localhost:8080
ENV VITE_REST_API_URL=${VITE_REST_API_URL}

RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace the default nginx config with our SPA-aware one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
