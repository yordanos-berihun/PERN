FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && if [ \"$SEED_ON_STARTUP\" = \"true\" ]; then node prisma/seed.js; fi && node server.js"]
