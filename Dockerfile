FROM oven/bun:latest AS builder
ENV UPLOAD_PATH="/var/opt/uploads"
WORKDIR /app
COPY . /app
RUN bun i && bun run build

FROM oven/bun:latest
WORKDIR /app
ENV UPLOAD_PATH="/var/opt/uploads"
COPY --from=builder /app/projects/app/.output /app
EXPOSE 8000
ENTRYPOINT ["bun", "run", "/app/server/index.mjs"]
