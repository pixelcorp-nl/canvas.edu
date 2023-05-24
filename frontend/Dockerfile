FROM node:18-alpine

WORKDIR /app

HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 CMD wget -q -O - http://localhost:5173/api/health

EXPOSE 8080

ENV NODE_ENV=production
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run build
RUN pnpm run lint:check
ENV PORT=5173

# USER node
ENTRYPOINT [ "npm", "start" ]
