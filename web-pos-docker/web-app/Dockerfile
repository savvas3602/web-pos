# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA-aware nginx config with runtime API_URL injection.
# The nginx image's entrypoint runs envsubst on *.template files
# in /etc/nginx/templates/ and outputs to /etc/nginx/conf.d/.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Only substitute API_URL in the nginx template.
ENV NGINX_ENVSUBST_FILTER="API_URL"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
