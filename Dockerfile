FROM node:22-slim AS builder
WORKDIR /app

RUN set -eu; \
  corepack enable; \
  for attempt in 1 2 3 4 5; do \
    if corepack prepare pnpm@10.33.4 --activate; then \
      break; \
    fi; \
    if [ "$attempt" = "5" ]; then \
      exit 1; \
    fi; \
    sleep 10; \
  done

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY projects/app/package.json ./projects/app/package.json
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm --store-dir /pnpm/store fetch --frozen-lockfile

COPY . /app
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm --store-dir /pnpm/store install --frozen-lockfile --offline && pnpm run generate

FROM nginx:latest
COPY --from=builder /app/projects/app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
