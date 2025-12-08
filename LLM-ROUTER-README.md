# 🤖 LLM Router System - Multi-Provider AI Integration

## Overview

The LLM Router system provides intelligent routing to multiple AI providers, automatically selecting the best model for each task type. This eliminates the need for `.env` files and gives end users full control over their AI configuration.

## ✨ Features

- **Multi-Provider Support**: Google Gemini, Groq (fast inference), OpenAI, Anthropic Claude
- **Intelligent Task Routing**: Automatically routes requests to the best provider based on task type
- **User-Configurable**: No `.env` files needed - users configure API keys through UI
- **Cost-Aware**: Displays cost per million tokens for each provider
- **Performance Optimized**: Shows latency characteristics (fast/medium/slow)
- **Fallback System**: Automatically tries fallback providers if primary fails
- **Settings Persistence**: Stores configuration in localStorage (can be upgraded to database)

## 🚀 Quick Start

### 1. Access Settings

Navigate to: **http://localhost:9002/settings**

Or click the **Settings** link in the top navigation bar.

### 2. Configure Your First Provider

1. Choose a provider (Gemini is recommended for starters)
2. Enter your API key
3. The system will auto-enable the provider
4. Click "Test Connection" to verify

### 3. Start Using AI Features

- Go to **Problems** → Select a problem → Click "Ask Guide" tab
- The AI assistant will automatically use your configured provider
- Chat with the Socratic tutor to test it out!

## 📋 Supported Providers

### Google Gemini (Recommended for Education)
- **Best for**: Socratic questioning, explanations, concept generation
- **Model**: `gemini-1.5-flash`
- **Cost**: $0.075 per 1M tokens
- **Speed**: Medium
- **Get API Key**: https://makersuite.google.com/app/apikey

### Groq (Fastest Inference)
- **Best for**: Fast inference, real-time interactions
- **Model**: `llama-3.3-70b-versatile`
- **Cost**: $0.59 per 1M tokens
- **Speed**: ⚡ Fast (< 500ms)
- **Get API Key**: https://console.groq.com/keys

### OpenAI GPT
- **Best for**: Explanations, reflection feedback
- **Model**: `gpt-4o-mini`
- **Cost**: $0.15 per 1M tokens
- **Speed**: Medium
- **Get API Key**: https://platform.openai.com/api-keys

### Anthropic Claude
- **Best for**: Socratic questioning, reflection feedback
- **Model**: `claude-3-5-haiku-20241022`
- **Cost**: $1.00 per 1M tokens
- **Speed**: Fast
- **Get API Key**: https://console.anthropic.com/account/keys

## 🎯 Task-Based Routing

The system automatically routes different task types to optimal providers:

| Task Type | Description | Default Provider | Alternative |
|-----------|-------------|------------------|-------------|
| **Socratic Questioning** | Deep reasoning with guided questions | Gemini | Anthropic |
| **Fast Inference** | Quick responses for simple questions | Groq | Gemini |
| **Explanation** | Detailed explanations of concepts | Gemini | OpenAI |
| **Reflection Feedback** | Evaluating student reflections | Gemini | Anthropic |
| **Concept Generation** | Creating new learning content | Gemini | OpenAI |

### Customizing Routing

1. Go to **Settings** → **Task Routing** tab
2. Select a task type
3. Choose your preferred provider
4. Icons with ⚡ indicate the provider's strength for that task

## 💡 Usage in Code

### For Developers

The LLM Router is used automatically in server actions:

```typescript
// src/ai/flows/ai-tutor-router.ts
import { getLLMRouter } from '@/lib/llm-router';

const router = getLLMRouter();
const response = await router.generate({
  systemPrompt: 'You are a helpful tutor...',
  prompt: 'Student question here',
  taskType: 'socratic-questioning',
  maxTokens: 500,
  temperature: 0.7,
});

console.log(`Response from ${response.provider}: ${response.text}`);
console.log(`Latency: ${response.latencyMs}ms`);
```

### Creating New AI Features

```typescript
'use server';

import { getLLMRouter } from '@/lib/llm-router';

export async function generateExample(topic: string) {
  const router = getLLMRouter();

  const response = await router.generate({
    prompt: `Generate an example for: ${topic}`,
    taskType: 'concept-generation',
    maxTokens: 300,
  });

  return response.text;
}
```

## 🔒 Security

- **API Keys Stored Locally**: Keys are stored in browser localStorage (not server)
- **Never Committed to Git**: No `.env` files in repository
- **User-Managed**: Each user configures their own API keys
- **Server Actions**: AI calls use Next.js server actions for security
- **No Key Exposure**: API keys never sent to client-side code

### For Production (Future Enhancement)

To upgrade from localStorage to database storage:

1. Create database schema for user settings
2. Replace `LLMSettingsService` localStorage calls with DB calls
3. Add authentication to settings page
4. Encrypt API keys in database

## 🐛 Troubleshooting

### "No provider configured" Error

**Solution**: Go to Settings and add at least one API key.

### API Key Not Working

1. Go to Settings
2. Click "Test Connection" for the provider
3. Check error message
4. Verify API key is correct and active
5. Check provider's dashboard for quota/billing issues

### Slow Responses

1. Check provider's latency rating (Settings page)
2. Consider using Groq for faster responses
3. Go to **Task Routing** tab and assign fast tasks to Groq

### Provider Unavailable

The system will automatically try the fallback provider. Check Settings to see which provider is set as fallback.

## 📊 Monitoring

Each AI response includes:
- `provider`: Which provider was used
- `model`: Specific model name
- `tokensUsed`: Total tokens consumed
- `latencyMs`: Response time in milliseconds

View these in browser console (developer tools) during development.

## 🔄 Migration from Old System

If you were using the old `.env.local` Genkit system:

1. **Get your API key** from `.env.local` file
2. **Go to Settings** in the app
3. **Add the key** to Gemini provider
4. **Enable the provider**
5. **Delete `.env.local`** (optional, but recommended)

The new system is fully backward compatible - all existing features work the same.

## 🎓 Best Practices

### For End Users

1. **Start with one provider** (Gemini recommended)
2. **Test before using**: Always click "Test Connection"
3. **Monitor costs**: Check provider dashboards for usage
4. **Use task routing**: Let the system pick the best provider for each task

### For Developers

1. **Always specify taskType**: Helps router select optimal provider
2. **Handle errors gracefully**: Router throws clear error messages
3. **Use appropriate maxTokens**: Don't request more than needed
4. **Test with multiple providers**: Ensure fallback works

## 📚 Additional Resources

- **LLM Types**: `src/lib/llm-types.ts` - Type definitions and capabilities
- **Settings Service**: `src/lib/llm-settings.ts` - Configuration management
- **Router Implementation**: `src/lib/llm-router.ts` - Core routing logic
- **Settings UI**: `src/app/settings/page.tsx` - Configuration interface
- **Example Usage**: `src/ai/flows/ai-tutor-router.ts` - Real-world implementation

## 🤝 Contributing

To add a new provider:

1. Add provider to `LLMProvider` type in `llm-types.ts`
2. Add capabilities to `PROVIDER_CAPABILITIES`
3. Implement `call{Provider}` method in `llm-router.ts`
4. Install provider's SDK: `npm install provider-sdk`
5. Update Settings UI to show new provider

## 📝 License

This LLM Router system is part of the Learner-Journey educational platform.

---

**Need Help?** Check the Settings page for provider status and test connections.
