# Vercel Deployment Guide

This guide will walk you through deploying the Crit-Fumble web application to Vercel.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you haven't already
3. **Discord Application**: Set up at [Discord Developer Portal](https://discord.com/developers/applications)
4. **Database**: A PostgreSQL database (recommended: Vercel Postgres, PlanetScale, or Supabase)

## Step 1: Deploy to Vercel

### Option A: Deploy via GitHub Integration (Recommended)

1. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (leave default)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `.next` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

3. **Deploy**: Click "Deploy" and wait for the initial deployment

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account/team
# - Link to existing project? No
# - Project name? crit-fumble-web (or your preferred name)
# - Directory? ./ (current directory)
```

## Step 2: Configure Environment Variables

In your Vercel dashboard, go to **Project Settings** → **Environment Variables** and add:

### Required Variables

```bash
# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
NODE_ENV=production

# Database (replace with your database URL)
DATABASE_URL=postgresql://username:password@host:port/database?schema=public

# Discord Application
DISCORD_WEB_BOT_APP_ID=your_discord_application_id
DISCORD_WEB_BOT_TOKEN=your_discord_bot_token
AUTH_DISCORD_PUBLIC_KEY=your_discord_public_key
AUTH_DISCORD_ID=your_discord_application_id
AUTH_DISCORD_SECRET=your_discord_client_secret

# Optional: World Anvil Integration
WORLD_ANVIL_API_URL=https://www.worldanvil.com/api/external/boromir
WORLD_ANVIL_KEY=your_world_anvil_key
WORLD_ANVIL_TOKEN=your_world_anvil_token

# Optional: OpenAI Integration  
OPENAI_API_KEY=your_openai_api_key
```

### Setting Variables in Vercel Dashboard

1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable with:
   - **Name**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Variable value
   - **Environments**: Select **Production**, **Preview**, and **Development**

## Step 3: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. In your Vercel project dashboard:
   - Go to **Storage** tab
   - Click **Create Database** → **Postgres**
   - Follow the setup wizard
   - Copy the `DATABASE_URL` to your environment variables

### Option B: External Database

1. Set up PostgreSQL on your preferred provider (PlanetScale, Supabase, Railway, etc.)
2. Add the connection string to `DATABASE_URL` environment variable
3. Ensure the database is accessible from Vercel's network

### Run Database Migrations

After setting up the database:

```bash
# From your local development environment
# Make sure DATABASE_URL points to your production database
npm run db:migrate --workspace=@crit-fumble/core
```

## Step 4: Configure Discord Application

Update your Discord Application settings with production URLs:

### In Discord Developer Portal

1. **General Information** → **Interactions Endpoint URL**:
   ```
   https://your-project-name.vercel.app/api/discord/webhooks
   ```

2. **OAuth2** → **Redirects**:
   ```
   https://your-project-name.vercel.app/api/discord/oauth2/callback
   ```

3. **General Information** → **Privacy Policy URL**:
   ```
   https://your-project-name.vercel.app/privacy-policy
   ```

4. **General Information** → **Terms of Service URL**:
   ```
   https://your-project-name.vercel.app/terms-of-service
   ```

5. **Linked Roles** → **Verification URL**:
   ```
   https://your-project-name.vercel.app/verify-user
   ```

## Step 5: Test Deployment

### Register Discord Commands

Make a POST request to register your slash commands:

```bash
curl -X POST https://your-project-name.vercel.app/api/discord/bot \
  -H "Content-Type: application/json" \
  -d '{"action": "register_commands"}'
```

### Test Authentication

1. Visit `https://your-project-name.vercel.app`
2. Click "Login with Discord"
3. Complete OAuth flow
4. Verify you're redirected to dashboard

### Test Discord Interactions

1. Go to a Discord server where your bot is installed
2. Try a slash command (e.g., `/event`, `/campaign`, `/character`)
3. Verify the webhook responds correctly

### Test Cron Jobs

- Vercel will automatically run the cron job every 5 minutes
- Check **Functions** tab in Vercel dashboard for cron execution logs

## Step 6: Monitor and Maintain

### View Logs

1. **Function Logs**: Vercel Dashboard → **Functions** tab
2. **Cron Logs**: Vercel Dashboard → **Functions** → **Crons**
3. **Real-time Logs**: `vercel logs` (CLI)

### Common Issues

1. **Environment Variables**: Double-check all variables are set correctly
2. **Database Connection**: Ensure DATABASE_URL is correct and accessible
3. **Discord Webhook**: Verify the interactions endpoint URL in Discord Developer Portal
4. **Build Errors**: Check the **Functions** tab for detailed error logs

### Production Optimizations

1. **Database Connection Pooling**: Consider using a connection pooler like PgBouncer
2. **Error Monitoring**: Add Sentry or similar error tracking
3. **Performance Monitoring**: Use Vercel Analytics
4. **Custom Domain**: Add your custom domain in Project Settings

## Success Checklist

- [ ] Application builds and deploys successfully
- [ ] All environment variables are configured
- [ ] Database is connected and migrations are run
- [ ] Discord OAuth authentication works
- [ ] Discord slash commands respond correctly
- [ ] Cron jobs are running (check after 5 minutes)
- [ ] Error monitoring is set up (optional)
- [ ] Custom domain is configured (optional)

## Need Help?

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Discord Developer Portal**: [discord.com/developers](https://discord.com/developers)
- **Project Issues**: Check the GitHub repository for known issues

Your Crit-Fumble application should now be live and ready to use! 🎲