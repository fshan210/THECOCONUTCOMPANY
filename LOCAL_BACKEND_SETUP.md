# Local Backend Setup

## Install

```bash
npm install
npm install --prefix packages/contracts
npm install --prefix backend
npm install --prefix infra
```

## Environment

Copy `.env.example` to local env files as needed. Do not commit `.env.local`.

Minimum local API variables:

```bash
APP_ENV=local
AWS_REGION=ap-south-1
API_ALLOWED_ORIGINS=http://localhost:3000
COMMERCE_TABLE_NAME=dotco-local-commerce
CONTENT_TABLE_NAME=dotco-local-content
AUDIT_TABLE_NAME=dotco-local-audit
```

For local protected-route testing only:

```bash
ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS=true
```

Do not use the bypass outside local tests.

## Run local API

```bash
npm --prefix backend run dev
```

API defaults to `http://localhost:8787`.

## Validate

```bash
npm run test
npm --prefix backend run typecheck
npm --prefix infra run synth
```
