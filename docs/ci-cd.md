# CI/CD Setup (GitHub Actions + EAS)

This project uses:
- **GitHub Actions** for CI (lint + typecheck)
- **Expo EAS** for CD (build, optional submit, optional update)

## 1) Required GitHub Secrets

Add these in GitHub repo settings (`Settings -> Secrets and variables -> Actions`):

- `EXPO_TOKEN` (required):
  - Generate with `npx eas-cli login` then `npx eas-cli whoami` / Expo dashboard access token.
- `EXPO_APPLE_ID` / `EXPO_APPLE_APP_SPECIFIC_PASSWORD` / `EXPO_ASC_APP_ID` (optional):
  - Needed when enabling iOS store submit automation.
- `EXPO_ANDROID_KEYSTORE_BASE64` and related Android signing secrets (optional):
  - Needed if you want fully automated Android store submit with custom credentials.

> Build-only pipelines need only `EXPO_TOKEN`.

## 2) Workflows

### CI (`.github/workflows/ci.yml`)
Runs on PRs and pushes to `main`:
- `npm ci`
- `npm run lint`
- `npx tsc --noEmit`

### Release (`.github/workflows/release.yml`)
Manual trigger (`Run workflow`) with inputs:
- `profile`: `preview` or `production`
- `platform`: `all`, `android`, or `ios`
- `submit`: whether to run `eas submit`
- `run_update`: whether to run `eas update`
- `channel` + `update_message`: required for update use-cases

## 3) EAS Profiles

Defined in `eas.json`:
- `development`: internal dev-client builds
- `preview`: internal distribution builds
- `production`: production build with auto-increment

## 4) Recommended Branch Strategy

- PR -> CI checks must pass
- Merge to `main`
- Run `Release (EAS)` workflow manually for controlled releases

## 5) First-Time Local EAS Init

Run once locally:

```bash
npx eas-cli login
npx eas-cli build:configure
```

This links the project to your Expo account and initializes credentials metadata.

## 6) Manual Build Scripts (local)

Use these from your machine when you want to trigger builds manually:

```bash
# Preview builds
npm run eas:build:preview:android
npm run eas:build:preview:ios
npm run eas:build:preview:all

# Production builds
npm run eas:build:production:android
npm run eas:build:production:ios
npm run eas:build:production:all

# Submit production builds
npm run eas:submit:production:android
npm run eas:submit:production:ios

# OTA updates
npm run eas:update:preview
npm run eas:update:production
```
