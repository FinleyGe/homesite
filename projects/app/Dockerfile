FROM node:20-slim
RUN mkdir /app
WORKDIR /app
COPY .output/ /app
RUN apt-get update -y && apt-get install -y openssl
CMD ["node", "server/index.mjs"]
