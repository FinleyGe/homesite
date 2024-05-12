FROM node:20-slim
COPY dist /app
WORKDIR /app
RUN npm install
CMD ["node", "main.js"]
