# Local toolchain audit — 2026-07-12

## Confirmed environment

| Item | Observed | Assessment |
| --- | --- | --- |
| Machine architecture | `arm64` | Native Apple Silicon |
| macOS | 26.5.1 (25F80) | Current local environment |
| Homebrew | `/opt/homebrew` | Native Apple Silicon installation |
| Node | `/usr/local/bin/node`, v24.16.0, `arm64` | Works, but lives in legacy `/usr/local` |
| npm | `/usr/local/bin/npm`, v11.13.0 | Works, shares legacy global prefix |
| npm global prefix | `/usr/local` | Do not use `sudo npm install -g` |
| Git | `/usr/bin/git`, 2.50.1 | Available |

## Assessment

The machine is arm64-native, but Node/npm use the legacy `/usr/local` prefix rather than Homebrew's `/opt/homebrew`. This is a mixed layout, not an active failure: the Node binary itself is arm64 and the project builds successfully. Do not recursively change ownership, delete `/usr/local`, use `chmod 777`, or install global npm tools with sudo.

## Recommended long-term cleanup

1. Keep project dependencies local and use `npx` for one-off CLIs.
2. When a Node upgrade is planned, install an arm64 Node manager or Homebrew Node deliberately, then migrate one project at a time.
3. Compare `node`, `npm`, and `corepack` paths after migration before removing any legacy Node installation.
4. Do not change the current Node installation as part of the AWS/Cognito correction work.

## Repository safety

`.gitignore` excludes `.env`, `.env.local`, `.env*`, `cdk.out`, and `infra/cdk.out`. The repository does not currently ignore a home-directory `.aws` folder because it is outside the repository; no local AWS cache or credential file is tracked.
