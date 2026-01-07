FROM oven/bun:1.3.4 AS builder
WORKDIR /app
COPY . /app
RUN bun i && bun run generate

FROM nginx:latest
COPY --from=builder /app/projects/app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
