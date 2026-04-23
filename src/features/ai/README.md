# 🔥 AI Core Pipeline

**Shared infrastructure** for AI interactions across the entire app.

This is the central hub for:

- LLM interactions (OpenAI, Claude, etc.)
- Speech-to-text processing
- Text-to-speech synthesis
- Input validation and safety guardrails
- AI interaction logging

## Modules

### `llm/`

- **client.ts** - OpenAI/Claude API client
- **prompts.ts** - Prompt templates and engineering

Example:

```typescript
import { generateResponse } from "@/features/ai/llm/client";

const response = await generateResponse("What is AI?");
```

### `stt/`

Speech-to-text conversion (Whisper, etc.)

```typescript
import { transcribeAudio } from "@/features/ai/stt";

const text = await transcribeAudio(audioBuffer);
```

### `tts/`

Text-to-speech synthesis (ElevenLabs, Google TTS, etc.)

```typescript
import { synthesizeAudio } from "@/features/ai/tts";

const audioBuffer = await synthesizeAudio("Hello, world!");
```

### `guardrails/`

Input validation, safety checks, content filtering

```typescript
import { validateInput } from "@/features/ai/guardrails";

const isValid = validateInput(userMessage);
```

### `logging/`

Track and log AI interactions for debugging

```typescript
import { logInteraction } from "@/features/ai/logging";

logInteraction({ input, output, model: "gpt-4" });
```

## Usage Across Features

```typescript
// chat feature using AI pipeline
import { generateResponse } from "@/features/ai/llm/client";
import { validateInput } from "@/features/ai/guardrails";

// voice feature using AI pipeline
import { transcribeAudio } from "@/features/ai/stt";
import { synthesizeAudio } from "@/features/ai/tts";
```

## Adding New AI Services

1. Create new folder in `features/ai/`
2. Implement service client
3. Export from `index.ts`
4. Document usage
