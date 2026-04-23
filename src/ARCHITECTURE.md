# VoiceAIApp Architecture

This project follows a **feature-based architecture** with clear separation of concerns.

## Directory Structure

```
src/
│
├── app/                     # App setup (navigation, providers, store)
│   ├── navigation/          # Expo Router setup, navigation configs
│   ├── store/              # Redux/Zustand (state management)
│   └── config/             # App configuration, constants
│
├── features/               # Feature modules (domain-driven)
│   ├── chat/
│   │   ├── components/     # Chat UI components
│   │   ├── screens/        # Chat screens/pages
│   │   ├── hooks/          # Custom hooks (useChat, etc.)
│   │   ├── services/       # Chat business logic
│   │   └── types/          # TypeScript interfaces
│   │
│   ├── voice/
│   │   ├── components/     # Voice recording UI
│   │   ├── hooks/          # useVoiceRecorder, etc.
│   │   ├── services/       # Voice handling logic
│   │   └── utils/          # Audio utilities
│   │
│   ├── ai/                 # 🔥 CORE AI PIPELINE (shared across features)
│   │   ├── llm/
│   │   │   ├── client.ts   # OpenAI/Claude API calls
│   │   │   └── prompts.ts  # Prompt templates
│   │   │
│   │   ├── stt/            # Speech-to-text (Whisper, etc.)
│   │   ├── tts/            # Text-to-speech (ElevenLabs, etc.)
│   │   ├── guardrails/     # Input validation, safety checks
│   │   └── logging/        # AI interaction logging
│   │
│   └── auth/ (optional)    # Authentication feature
│
├── shared/                 # Reusable across features
│   ├── components/         # Generic UI components (Button, Input, etc.)
│   ├── hooks/             # Generic hooks (useTheme, useAsync, etc.)
│   ├── utils/             # Utility functions (formatters, helpers)
│   └── constants/         # Global constants (theme, config)
│
└── services/              # Backend API clients
    └── api.ts             # Axios instance, API endpoints
```

## Key Principles

### 1. **Feature Isolation**

- Each feature is self-contained with its own `components`, `screens`, `hooks`, `services`, and `types`
- Features can be developed independently
- Minimal inter-feature dependencies

### 2. **AI Core Pipeline**

The `features/ai` module is **shared infrastructure** used by multiple features:

- **LLM**: Handles all OpenAI/Claude interactions
- **STT**: Converts speech → text
- **TTS**: Converts text → speech
- **Guardrails**: Validates inputs and ensures safety
- **Logging**: Tracks AI interactions for debugging

### 3. **Shared Layer**

- Only generic, reusable components live here
- Business logic stays in features
- Examples: theme constants, generic hooks, UI components

### 4. **Services Layer**

- Backend API communication
- HTTP clients (axios instances)
- Environment-specific configs

## Usage Examples

### Importing from Features

```typescript
// ✅ Good: Import from specific feature
import { useChat } from "@/features/chat/hooks/useChat";
import { ChatScreen } from "@/features/chat/screens/ChatScreen";

// ❌ Avoid: Importing from another feature's internals
import { ChatMessage } from "@/features/chat/components/ChatMessage";
```

### Importing Shared Utilities

```typescript
// ✅ Good: Use shared components and hooks
import { Button } from "@/shared/components/Button";
import { useTheme } from "@/shared/hooks/useTheme";
import { Colors } from "@/shared/constants/theme";
```

### Using AI Pipeline

```typescript
// ✅ Good: Multiple features can use AI core
import { generateResponse } from "@/features/ai/llm/client";
import { transcribeAudio } from "@/features/ai/stt/client";
import { synthesizeAudio } from "@/features/ai/tts/client";
```

## Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/app": ["src/app"],
      "@/features": ["src/features"],
      "@/shared": ["src/shared"],
      "@/services": ["src/services"]
    }
  }
}
```

## Migration Guide

### Moving Old Files to New Structure

1. **Components** → `src/shared/components/` or feature-specific `components/`
2. **Hooks** → `src/shared/hooks/` or feature-specific `hooks/`
3. **Constants** → `src/shared/constants/`
4. **Services** → `src/services/` (backend) or feature `services/`
5. **Navigation** → `src/app/navigation/`

## Dependency Flow

```
Features (chat, voice, auth)
    ↓ (use)
AI Core Pipeline (llm, stt, tts, guardrails)
    ↓ (use)
Shared Utilities (components, hooks, constants)
    ↓ (use)
External Libraries (React Native, Expo, etc.)
```

**Rule**: Lower layers should NOT depend on upper layers.

## Next Steps

1. Move remaining components from `/components` to `src/shared/components/`
2. Update `tsconfig.json` with path aliases
3. Update `App.js` entry point to use `src/app/navigation/`
4. Implement Redux/Zustand in `src/app/store/`
5. Create specific feature modules and types
