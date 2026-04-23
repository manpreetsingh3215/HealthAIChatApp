# Backend Services

API clients for communicating with your backend.

- **api.ts** - Axios instance with interceptors, base URL
- Feature-specific endpoints can live here or in feature services

Example:

```typescript
export const API = axios.create({
  baseURL: CONFIG.API_URL,
});

API.interceptors.response.use(
  (response) => response,
  (error) => handleAPIError(error),
);
```
