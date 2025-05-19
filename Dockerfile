# FROM oven/bun:1.2.2 AS builder
# ENV UPLOAD_PATH="/var/opt/uploads"
# WORKDIR /app
# COPY . /app
# RUN bun i && bun run build

# FROM oven/bun:1.2.2
# WORKDIR /app
# ENV UPLOAD_PATH="/var/opt/uploads"
# COPY --from=builder /app/projects/app/.output /app
# EXPOSE 8000
# ENTRYPOINT ["bun", "run", "/app/server/index.mjs"]

FROM node:20 AS builder
ENV UPLOAD_PATH="/var/opt/uploads"
WORKDIR /app
COPY . /app
RUN npm install -g pnpm@9 node-gyp
RUN pnpm i && pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV UPLOAD_PATH="/var/opt/uploads"
COPY --from=builder /app/projects/app/.output /app
EXPOSE 8000
ENTRYPOINT ["node", "/app/server/index.mjs"]
