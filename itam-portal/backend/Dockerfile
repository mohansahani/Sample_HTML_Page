# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY src ./src
COPY .env.example ./.env.example
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src/server.js"]