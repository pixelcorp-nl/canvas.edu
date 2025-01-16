FROM node:18-alpine AS builder-main
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
FROM node:18-alpine AS main
ENV NODE_ENV=production
ENV PORT=5173
WORKDIR /app
HEALTHCHECK --interval=5s --timeout=1s --start-period=1s --retries=3 CMD wget -q -O - http://127.0.0.1:5173/health

COPY --from=builder-main /app/package.json ./package.json
# COPY --from=builder-main /app/node_modules ./node_modules
COPY --from=builder-main /app/build ./build

CMD [ "build/index.js" ]
