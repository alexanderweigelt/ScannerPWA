FROM node:22-bookworm-slim

WORKDIR /app

# Canvas build deps (node-canvas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg62-turbo-dev \
    libgif-dev \
    librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

# pnpm via corepack
RUN corepack enable

# node-gyp soll Python sicher finden
ENV PYTHON=/usr/bin/python3