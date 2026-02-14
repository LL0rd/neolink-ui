# Stage 1: Get neolink binary
FROM quantumentangledandy/neolink:latest AS neolink

# Stage 2: Build the Nuxt app
FROM node:20-slim AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production runtime
FROM debian:bookworm-slim

# Install Node.js 20 and GStreamer dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    libgstreamer1.0-0 \
    libgstrtspserver-1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy neolink binary
COPY --from=neolink /usr/local/bin/neolink /usr/local/bin/neolink

# Copy built Nuxt app
COPY --from=builder /app/.output /app/.output

# Create default config directory
RUN mkdir -p /config && touch /config/neolink.toml

# Environment variables
ENV NODE_ENV=production
ENV NEOLINK_UI_PASSWORD=
ENV NEOLINK_CONFIG_PATH=/config/neolink.toml
ENV NEOLINK_BINARY_PATH=/usr/local/bin/neolink
ENV NEOLINK_MODE=rtsp
ENV HOST=0.0.0.0
ENV PORT=9080

EXPOSE 9080 8554

CMD ["node", "/app/.output/server/index.mjs"]
