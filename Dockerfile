FROM docker.io/oven/bun:1-slim

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY src ./src
COPY public ./public

RUN mkdir -p /data && chown bun:bun /data

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DB_PATH=/data/counters.db

USER bun
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "const r = await fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health'); if (!r.ok) process.exit(1)"

CMD ["bun", "run", "src/index.ts"]
