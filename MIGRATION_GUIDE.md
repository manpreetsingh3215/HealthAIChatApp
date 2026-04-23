# Migration Guide: Old Structure → New Feature-Based Architecture

## What Changed

Your project is transitioning from a **flat structure** to a **feature-based architecture** for better scalability and maintainability.

## File Movement Map

### Components Migration

```
OLD: components/
NEW: src/shared/components/ (generic)
     src/features/chat/components/ (chat-specific)
     src/features/voice/components/ (voice-specific)
```

| Old File                              | New Location                | Note                     |
| ------------------------------------- | --------------------------- | ------------------------ |
| `components/themed-text.tsx`          | `src/shared/components/`    | Generic UI component     |
| `components/themed-view.tsx`          | `src/shared/components/`    | Generic UI component     |
| `components/hello-wave.tsx`           | `src/shared/components/`    | Reusable animation       |
| `components/parallax-scroll-view.tsx` | `src/shared/components/`    | Generic scroll component |
| `components/haptic-tab.tsx`           | `src/shared/components/`    | Reusable tab component   |
| `components/external-link.tsx`        | `src/shared/components/`    | Generic link component   |
| `components/ui/`                      | `src/shared/components/ui/` | UI primitives            |

### Constants Migration

```
OLD: constants/theme.ts
NEW: src/shared/constants/theme.ts
```

### Hooks Migration

```
OLD: hooks/
NEW: src/shared/hooks/
```

| Old File                        | New Location        |
| ------------------------------- | ------------------- |
| `hooks/use-color-scheme.ts`     | `src/shared/hooks/` |
| `hooks/use-color-scheme.web.ts` | `src/shared/hooks/` |
| `hooks/use-theme-color.ts`      | `src/shared/hooks/` |

### Services Migration

```
OLD: services/api.js
NEW: src/services/api.ts
```

### Navigation

```
OLD: app/
NEW: src/app/navigation/
```

## Updated Import Paths

### Before (Old)

```typescript
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { sendMessage } from "@/services/api";
```

### After (New)

```typescript
import { ThemedText } from "@/shared/components/themed-text";
import { Colors } from "@/shared/constants/theme";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { sendMessage } from "@/services/api";
```

## Step-by-Step Migration

### Phase 1: Move Files (Completed ✅)

- [x] Created new directory structure under `src/`
- [x] Updated `tsconfig.json` with path aliases
- [x] Copied theme constants to `src/shared/constants/`
- [x] Copied API client to `src/services/`

### Phase 2: Move Components & Hooks (Next)

```bash
# Move shared components
mv components/*.tsx src/shared/components/

# Move shared hooks
mv hooks/*.ts src/shared/hooks/
```

### Phase 3: Update All Imports (In Progress)

Run find-and-replace in your editor:

- `@/components/` → `@/shared/components/`
- `@/constants/` → `@/shared/constants/`
- `@/hooks/` → `@/shared/hooks/`
- `@/services/api` → `@/services/api`

### Phase 4: Move App Navigation

- Copy `app/(tabs)/*` to `src/app/navigation/` if needed
- Update routing configuration

### Phase 5: Feature-Specific Setup

Create feature modules for:

- **Chat**: Components, screens, hooks, services
- **Voice**: Recording, playback, utilities
- **AI**: LLM, STT, TTS integrations

## Quick Reference

### Path Aliases (All Updated in tsconfig.json)

```
@/*          → src/*
@/app        → src/app
@/features   → src/features
@/shared     → src/shared
@/services   → src/services
```

### New Folder Structure

```
VoiceAIApp/
├── src/
│   ├── app/              (NEW)
│   ├── features/         (NEW)
│   ├── shared/           (NEW)
│   └── services/         (NEW)
│
├── app/                  (Keep for now - Expo Router)
├── components/           (Migrate to src/)
├── constants/            (Migrate to src/shared/)
├── hooks/                (Migrate to src/shared/)
├── services/             (Migrate to src/)
└── assets/               (Keep as-is)
```

## Validation Checklist

After migration:

- [ ] No TypeScript errors
- [ ] All imports resolve correctly
- [ ] App builds successfully
- [ ] No broken references
- [ ] All tests pass

## Need Help?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for structure details
- Review feature-specific READMEs
- Check path aliases in `tsconfig.json`

---

**Status**: Structure created. Next: Move existing files to new locations.
