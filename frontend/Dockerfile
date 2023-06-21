FROM node:18-alpine as builder-main
WORKDIR /app

RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . ./

RUN pnpm run check
RUN pnpm run lint:check
RUN pnpm run build
RUN pnpm prune --prod

# =============== MAIN ===============
FROM node:18-alpine as main
ENV NODE_ENV=production
ENV PORT=5173
WORKDIR /app
HEALTHCHECK --interval=5s --timeout=5s --start-period=10s --retries=3 CMD wget -q -O - http://localhost:5173/health

COPY --from=builder-main /app ./

# This can not be "node build/index.js" because of the incomplete build system
ENTRYPOINT [ "npm", "run", "production" ]
