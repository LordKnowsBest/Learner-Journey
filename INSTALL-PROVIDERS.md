# Installing Additional LLM Providers

## Quick Start (Works Immediately)

✅ **Gemini** and ✅ **Groq** are pre-installed and ready to use!

1. Go to **Settings** (http://localhost:9002/settings)
2. Add your API key for Gemini or Groq
3. Start using the AI assistant immediately

## Optional Providers

### OpenAI (Optional)

If you want to use OpenAI GPT models:

```bash
npm install openai
```

Then configure in Settings with your OpenAI API key from https://platform.openai.com/api-keys

### Anthropic Claude (Optional)

If you want to use Claude models:

```bash
npm install @anthropic-ai/sdk
```

Then configure in Settings with your Anthropic API key from https://console.anthropic.com/account/keys

## Troubleshooting npm install

If `npm install` hangs or times out:

### Option 1: Use yarn instead
```bash
yarn add openai @anthropic-ai/sdk
```

### Option 2: Install one at a time
```bash
npm install openai
# Wait for it to complete
npm install @anthropic-ai/sdk
```

### Option 3: Use a faster registry
```bash
npm install --registry=https://registry.npmmirror.com openai @anthropic-ai/sdk
```

## System Works Without These!

The application is fully functional with just Gemini and Groq. You only need OpenAI/Anthropic if you specifically want to use those providers.

**Recommended for most users**: Just use Gemini (free tier available) or Groq (ultra-fast inference).
