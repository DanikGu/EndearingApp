# Use the official Node.js image
FROM node:22.7.0 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22.7.0
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
