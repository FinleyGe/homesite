FROM oven/bun:latest AS builder
WORKDIR /app
COPY . /app
RUN bun i -p && bun run build

FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/projects/app/.output /app
EXPOSE 8000
ENTRYPOINT ["bun", "run", "/app/server/index.mjs"]
