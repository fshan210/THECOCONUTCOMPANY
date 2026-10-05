# Railway builds the Next.js runtime only. AWS/Firebase/media remain external.
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/contracts ./packages/contracts
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DEPLOY_TARGET=railway
ENV APP_HOST_PLATFORM=railway
# Only public configuration and provenance may enter build arguments.
ARG APP_DEPLOY_ENV
ARG RAILWAY_GIT_COMMIT_SHA
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_DOTCO_API_BASE_URL
ARG NEXT_PUBLIC_COGNITO_USER_POOL_ID
ARG NEXT_PUBLIC_COGNITO_APP_CLIENT_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_MEDIA_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ARG NEXT_PUBLIC_BING_SITE_VERIFICATION
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_CLARITY_PROJECT_ID
RUN node scripts/railway-build-manifest.mjs
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nextjs && useradd --system --uid 1001 --gid nextjs nextjs
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/deployment-build.json ./deployment-build.json
COPY --from=builder --chown=nextjs:nextjs /app/lib/deployment ./lib/deployment
COPY --from=builder --chown=nextjs:nextjs /app/scripts/railway-start.mjs ./scripts/railway-start.mjs
USER nextjs
EXPOSE 3000
CMD ["node", "scripts/railway-start.mjs"]
