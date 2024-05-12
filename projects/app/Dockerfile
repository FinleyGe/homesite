FROM node:20-slim
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm run build
CMD ["node", "server/index.mjs"]
