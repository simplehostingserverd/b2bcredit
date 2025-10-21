# AI Integration Setup Guide

## 🆓 100% FREE AI Models

This application integrates with **FREE** AI providers - no paid subscriptions required!

---

## Quick Setup (5 minutes)

### Step 1: Choose a Provider

We recommend **Groq** (fastest, completely free):

| Provider | Speed | Free Tier | Models |
|----------|-------|-----------|---------|
| **Groq** ⭐ | ⚡ Very Fast | Unlimited | Llama 3.1, Mixtral, Gemma |
| Hugging Face | 🐢 Slow | Limited | Llama, Mixtral, Phi-3 |
| Together AI | ⚡ Fast | $25 free credits | Llama, Mixtral, Nous-Hermes |

### Step 2: Get Your FREE API Key

#### Option A: Groq (Recommended)

1. Go to: https://console.groq.com
2. Sign up (free, no credit card)
3. Go to "API Keys"
4. Click "Create API Key"
5. Copy the key

#### Option B: Hugging Face

1. Go to: https://huggingface.co/settings/tokens
2. Sign up/Login
3. Click "New token"
4. Name it "b2bcredit" 
5. Copy the token

#### Option C: Together AI

1. Go to: https://api.together.xyz
2. Sign up (get $25 free credits)
3. Go to "API Keys"
4. Create new key
5. Copy the key

### Step 3: Add to Environment Variables

In Coolify (or your `.env` file):

```bash
# Choose ONE provider
AI_PROVIDER=GROQ

# Add the API key for your chosen provider
GROQ_API_KEY=your_groq_api_key_here

# OR for Hugging Face:
# AI_PROVIDER=HUGGINGFACE
# HUGGINGFACE_API_KEY=your_hf_token_here

# OR for Together AI:
# AI_PROVIDER=TOGETHER
# TOGETHER_API_KEY=your_together_key_here
```

### Step 4: Redeploy

Redeploy your application in Coolify to apply the environment variables.

---

## Features Enabled

Once configured, admins can:

### 1. **AI Application Analysis**
- Click "Analyze with AI" on any application
- Get instant risk assessment (Low/Medium/High)
- See key strengths and concerns
- Get recommendation (Approve/Reject/Request Info)
- AI-powered reasoning

### 2. **Auto-Generated Letters**
- **Rejection Letters**: Professional, empathetic rejection emails
- **Approval Letters**: Congratulatory approval emails
- One-click generation with AI

### 3. **Smart Insights**
- Analyzes business financials
- Considers credit score, revenue, debt ratio
- Evaluates years in business
- Assesses funding request reasonableness

---

## Available Models

### Groq (Recommended)
- `llama-3.1-70b-versatile` - Most capable, slower
- `llama-3.1-8b-instant` ⭐ - Default, fast & good
- `mixtral-8x7b-32768` - Good for complex analysis
- `gemma2-9b-it` - Fast alternative

### Hugging Face
- `meta-llama/Meta-Llama-3-8B-Instruct`
- `mistralai/Mixtral-8x7B-Instruct-v0.1`
- `microsoft/Phi-3-mini-4k-instruct`
- `google/gemma-2-9b-it`

### Together AI
- `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo`
- `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`
- `mistralai/Mixtral-8x7B-Instruct-v0.1`
- `NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO`

---

## Usage Examples

### In Admin Panel

**On Application Detail Page:**

1. **Analyze Application**
   - Click "🤖 Analyze with AI" button
   - Wait 2-5 seconds
   - View AI-generated analysis
   - Use insights to make decision

2. **Generate Rejection Letter**
   - Enter rejection reason
   - Click "Generate Rejection Letter"
   - AI writes professional letter
   - Copy/edit as needed

3. **Generate Approval Letter**
   - Click "Approve"
   - Click "Generate Approval Letter"
   - AI writes congratulatory letter
   - Send to applicant

---

## Cost Comparison

| Provider | Monthly Cost | Rate Limits |
|----------|--------------|-------------|
| Groq | **$0** | Very generous (free) |
| Hugging Face | **$0** | 1000 requests/day (free tier) |
| Together AI | **$0** | $25 free credits (then pay-as-you-go) |

**Our Recommendation:** Start with Groq - it's completely free, unlimited, and the fastest.

---

## Troubleshooting

### Error: "API key not configured"

**Problem:** Environment variable not set

**Solution:**
1. Check Coolify environment variables
2. Ensure `GROQ_API_KEY` (or your provider's key) is set
3. Redeploy the application

### Error: "Rate limit exceeded"

**Problem:** Too many requests (Hugging Face free tier)

**Solution:**
1. Switch to Groq (no rate limits)
2. Or wait a few minutes and try again

### AI Returns Generic Response

**Problem:** Model not understanding context

**Solution:**
1. Try a different model (e.g., llama-3.1-70b-versatile)
2. Ensure application has complete data filled in

### Slow Response

**Problem:** Provider is slow or overloaded

**Solution:**
1. Switch to Groq (fastest)
2. Use `llama-3.1-8b-instant` model
3. Or try Together AI

---

## Technical Details

### API Integration

The AI system uses:
- **Client**: `lib/ai/client.ts` - AI client wrapper
- **Providers**: `lib/ai/providers.ts` - Provider configurations
- **API Endpoint**: `/api/ai/analyze` - Analysis endpoint

### Supported Actions

```typescript
// Analyze application
POST /api/ai/analyze
{
  "application": { ...applicationData },
  "action": "analyze"
}

// Generate rejection letter
POST /api/ai/analyze
{
  "application": { ...applicationData },
  "action": "generateRejection",
  "reason": "Insufficient revenue"
}

// Generate approval letter
POST /api/ai/analyze
{
  "application": { ...applicationData },
  "action": "generateApproval"
}
```

### Response Format

```typescript
{
  "success": true,
  "result": "AI-generated analysis or letter",
  "provider": "GROQ",
  "model": "llama-3.1-8b-instant"
}
```

---

## Privacy & Security

✅ **Data Privacy**
- Application data sent to AI provider for analysis only
- No data stored by AI providers (per their ToS)
- Results cached locally in browser

✅ **API Key Security**
- Keys stored securely in environment variables
- Never exposed to client-side code
- Only accessible by server-side API routes

✅ **Admin-Only Access**
- AI features only available to ADMIN and STAFF roles
- Requires authentication to use

---

## Future Enhancements

Planned AI features:
- [ ] Batch analyze multiple applications
- [ ] Custom AI prompts per business type
- [ ] Credit score prediction
- [ ] Fraud detection
- [ ] Auto-categorization of applications
- [ ] Sentiment analysis of application text

---

## Support

**Having issues?**
1. Check environment variables are set
2. Verify API key is valid (test at provider's dashboard)
3. Check application logs for detailed errors
4. Try switching providers

**Need a different model?**
Edit `lib/ai/providers.ts` to add custom models.

---

## Links

- Groq Console: https://console.groq.com
- Hugging Face Tokens: https://huggingface.co/settings/tokens
- Together AI: https://api.together.xyz
- AI Client Code: `/lib/ai/client.ts`
- Provider Config: `/lib/ai/providers.ts`

**Status:** ✅ Ready to use with FREE models
**Setup Time:** ~5 minutes
**Cost:** $0/month
