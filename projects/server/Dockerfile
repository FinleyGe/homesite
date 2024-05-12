FROM node
COPY dist /app
COPY package.json /app
WORKDIR /app
RUN npm install
CMD ["node", "main.js"]
