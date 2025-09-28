# Discord Application Configuration URLs

This document contains all the URLs needed to configure your Discord application in the Discord Developer Portal.

## 🔗 Application URLs

### Required URLs

#### Interactions Endpoint URL
```
https://your-domain.vercel.app/api/discord/webhooks
```
**Purpose**: Receives Discord interactions (slash commands, buttons, etc.) via HTTP POST  
**Status**: ✅ Implemented  
**File**: `app/api/discord/webhooks/route.ts`

#### Privacy Policy URL
```
https://your-domain.vercel.app/privacy-policy
```
**Purpose**: Link to your application's Privacy Policy  
**Status**: ✅ Page exists (needs content update)  
**File**: `app/privacy-policy/page.tsx`

#### Terms of Service URL
```
https://your-domain.vercel.app/terms-of-service
```
**Purpose**: Link to your application's Terms of Service  
**Status**: ✅ Page exists (needs content update)  
**File**: `app/terms-of-service/page.tsx`

### Optional URLs

#### Linked Roles Verification URL
```
https://your-domain.vercel.app/verify-user
```
**Purpose**: Enables your application as a requirement in server role links  
**Status**: ✅ Implemented  
**Files**: 
- `app/verify-user/page.tsx` (user interface)
- `app/api/discord/verify/route.ts` (verification API)

## 🛠️ Configuration Steps

### 1. Discord Developer Portal Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to "General Information"
4. Fill in the URLs above

### 2. OAuth2 Configuration
In the OAuth2 section, add these redirect URIs:
```
https://your-domain.vercel.app/api/discord/oauth2/callback
```

### 3. Bot Configuration
In the Bot section:
- Copy your bot token to `DISCORD_WEB_BOT_TOKEN`
- Copy your application ID to `DISCORD_WEB_BOT_APP_ID`
- Copy your public key to `AUTH_DISCORD_PUBLIC_KEY`

### 4. Slash Commands
Register your slash commands using:
```bash
curl -X POST https://your-domain.vercel.app/api/discord/bot \
  -H "Content-Type: application/json" \
  -d '{"action": "register_commands"}'
```

## 🎯 Features Enabled

### Interactions Endpoint
- ✅ Slash commands (`/event`, `/campaign`, `/character`)
- ✅ Button interactions
- ✅ Select menu interactions
- ✅ Autocomplete handling

### Linked Roles Verification
- ✅ D&D Player role verification
- ✅ Campaign member verification
- ✅ DM role verification
- ✅ Account age verification

### OAuth2 Authentication
- ✅ Discord login integration
- ✅ User account linking
- ✅ Guild access verification

## 🔒 Security

All endpoints include:
- ✅ Signature verification for Discord webhooks
- ✅ OAuth2 state validation
- ✅ Environment variable protection
- ✅ Error handling and logging

## 📝 Content Updates Needed

### Privacy Policy (`app/privacy-policy/page.tsx`)
Currently shows: "Shh... its a secret to everybody."
**Needs**: Proper privacy policy content

### Terms of Service (`app/terms-of-service/page.tsx`)
Currently shows: "Be excellent to each other."
**Needs**: Proper terms of service content

## 🚀 Deployment

All endpoints are automatically deployed with your Next.js application to Vercel. No additional configuration needed!

### Environment Variables
Make sure these are set in Vercel:
```bash
DISCORD_WEB_BOT_TOKEN=your_bot_token
DISCORD_WEB_BOT_APP_ID=your_app_id
AUTH_DISCORD_PUBLIC_KEY=your_public_key
AUTH_DISCORD_ID=your_client_id
AUTH_DISCORD_SECRET=your_client_secret
```