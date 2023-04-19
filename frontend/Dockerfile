FROM node:18-alpine

WORKDIR /app

# TODO: Add healthcheck
# HEALTHCHECK --interval=5s --timeout=10s --start-period=5s --retries=1 CMD wget -q -O - http://localhost:8080/

EXPOSE 8080

ENV NODE_ENV=production
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run lint:check
RUN pnmp run build

USER node
ENTRYPOINT [ "pnpm", "start" ]
