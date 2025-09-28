---
applyTo: '**'
---


## Current Architecture
### packages/next-web: Main web application
- uses @crit-fumble/core and @crit-fumble/react
- contains Next.js specific views and controllers in lib/ directory
- contains Discord webhook endpoints in app/api/discord/ for all Discord functionality
- deploys to vercel with automatic cron jobs for scheduled tasks
### packages/core: Shared data models, services, and utilities
- contains models, utils, controllers, and services shared by all applications
- contains 100% of the database schema, configuration, migration, utils, and controllers
- contains generic client-side utils, services, and controllers not requiring framework dependencies
- contains all migrations and data seeds
- package.json contains scripts for most common Prisma tasks
- uses Discord.js and OpenAI SDKs directly (no wrapper packages needed)
- clean DI-friendly config system in models/config/
### packages/react: Pure React components and hooks library
- framework-agnostic React components, hooks, and providers
- no Next.js dependencies - uses only React and @crit-fumble/core
- used by next-web and any future React-based applications
### packages/types: Lightweight type-only package
- provides TypeScript interfaces and types without runtime dependencies
- 75% smaller than core package (156K vs 631K)
- contains auth, discord, config, session, and cron types
- used for lightweight integrations that don't need full core package
### packages/worldanvil: World Anvil integration library
- wrapper package for World Anvil API (WorldAnvil has no official SDK)
- provides models, services, and controllers for World Anvil integration
- imported into @crit-fumble/core and re-exported
- minimal dependencies; only uses axios and yaml