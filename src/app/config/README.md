# App Config

Place environment-specific configurations here:

- API endpoints
- Feature flags
- App settings
- Build configs

Example:

```typescript
// config.ts
export const CONFIG = {
  API_URL: process.env.API_URL || "http://localhost:3000",
  ENABLE_LOGGING: true,
  MAX_RETRIES: 3,
};
```
