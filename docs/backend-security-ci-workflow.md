# Backend Security CI Workflow

GitHub rejected direct creation of `.github/workflows/backend-security-ci.yml` from the current OAuth token because it does not have `workflow` scope.

When pushing with a token that has `workflow` scope, create:

```txt
.github/workflows/backend-security-ci.yml
```

with this content:

```yaml
name: Backend security foundation CI

on:
  pull_request:
  push:
    branches:
      - main
      - "feature/**"

permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install frontend
        run: npm ci
      - name: Install contracts
        run: npm install --prefix packages/contracts
      - name: Install backend
        run: npm install --prefix backend
      - name: Install infra
        run: npm install --prefix infra
      - name: Lint frontend
        run: npm run lint
      - name: Typecheck frontend
        run: npm run typecheck
      - name: Test contracts
        run: npm --prefix packages/contracts test
      - name: Test backend
        run: npm --prefix backend test
      - name: Test infra
        run: npm --prefix infra test
      - name: Synth infra
        run: npm --prefix infra run synth
      - name: Build frontend
        run: npm run build
```

Production AWS deployment workflows should use GitHub Actions OIDC to assume a deployment role, not long-lived AWS keys.
