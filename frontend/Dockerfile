# ============== DEPS ===============
FROM node:18-alpine as dependencies
WORKDIR /app

# ========== BUILDER MAIN ===========
FROM dependencies as builder-main
WORKDIR /app

RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . ./

RUN pnpm run sync
RUN pnpm run lint:check
RUN pnpm run build
RUN pnpm prune --prod

# =============== MAIN ===============
FROM node:18-alpine as main
ENV NODE_ENV=production
ENV PORT=5173
WORKDIR /app
HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 CMD wget -q -O - http://localhost:5173/health

# This cannot be shortend to only copy the /build folder
# since some packages depend on the /src folder and many other files
COPY --from=builder-main /app ./

ENTRYPOINT [ "npm", "start" ]
