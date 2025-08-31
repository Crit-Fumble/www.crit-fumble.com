## Current Architecture
### packages/next-web: Main web application
- uses @crit-fumble/core and @crit-fumble/next
- deploys to vercel
### packages/discord-bot: Discord bot
- uses @crit-fumble/core
- deploys to a Fly.io instance
### packages/discord-app: Discord app
- uses @crit-fumble/core
- deployment details pending
### packages/discord-activity: Discord activity
- uses @crit-fumble/core
- deployment details pending
### packages/core: Core models, utils, and Prisma wrapper
- reads environment variables from .env files of the package it's installed into
- wraps @prisma/client, @vercel/blob, and other shared packages
- imports and re-exports @crit-fumble/discord, @crit-fumble/worldanvil, and @crit-fumble/openai
- used by all other packages
- defines models for all other packages
- contains server-side utils, services, and controllers for all other packages
- contains generic client-side utils, services, and controllers not requiring framework dependencies
- contains all migrations and data seeds
- package.json contains scripts for most common Prisma tasks
- contains most 3rd party dependencies
### packages/next: Next.js library code
- reads environment variables from .env files of the package it's installed into
- wraps Next.js, React, NextAuth, and related dependencies
- contains views (/w components), controllers (/w hooks, providers), services, and utils which wrap Next.js functionality or content
- environment variables are ONLY read by configs, which are ONLY read by server-side services
- used by web packages
- minimal back end dependencies; prefer @crit-fumble/core
### packages/discord: Discord integration library
- reads environment variables from .env files of the package it's installed into
- wraps discord.js
- imported into @crit-fumble/core and re-exported
- minimal dependencies; only ones required for discord packages
### packages/worldanvil: World Anvil integration library
- wraps World Anvil API
- provides models, services, and controllers for World Anvil integration
- imported into @crit-fumble/core and re-exported
- minimal dependencies; only uses axios and yaml
### packages/openai: OpenAI integration library
- wraps OpenAI API
- provides services for AI-powered features
- imported into @crit-fumble/core and re-exported
- minimal dependencies; only those required for OpenAI functionality

## TODO List
### Bot Instructions
- review the architecture above, but never modify it.
- review the entire list below for context, especially [COMPLETED] items
- first, check for any items in the list marked [BOT-REVIEW]; if any are found and review them; when complete, mark them as [HUMAN-REVIEW]
- start working the first item marked as [BOT-WIP] in the list, if one is available; do not start work on an item unless all above items are [COMPLETED]
- never touch items marked [WIP] or [NEEDS-REVIEW]; a human is completing these tasks
- if no [BOT-WIP] items are available, start the first [BOT-TODO] item in the list which has all above items [COMPLETED], and change it's status to [BOT-WIP]; do not start work on an item unless all items in the current phase are [COMPLETED]
- as you are working, leave comments under the relevant item to document your progress
- as you are working, if large scale changes are needed, insert a [TODO] in the appropriate package section
- if you are blocked on a task requiring human actions, decisions, or terminal commands, change the status to [BOT-BLOCKED], and wait for prompt
- if issues are detected with a [COMPLETED] item as you are iterating, change it's status to [HUMAN-REVIEW]; wait for prompt
- when you are done with an item, change it's status to [HUMAN-REVIEW]; only a human should ever change an item to [COMPLETED]

### Common Analysis & Setup (Completed)
- [COMPLETED] Review each package.json to document current dependencies
  - **Updated Packages Structure:**
    - **@crit-fumble/core (v6.8.2)**: Dependencies: @prisma/client, @vercel/blob, @crit-fumble/discord, @crit-fumble/worldanvil, @crit-fumble/openai
    - **@crit-fumble/next (v14.2.14)**: Dependencies: next, next-auth, react, react-dom, react-hook-form, react-hot-toast
    - **@crit-fumble/discord (v14.14.1)**: Dependencies: discord.js, @napi-rs/canvas, dotenv, node-cron, node-fetch
    - **@crit-fumble/worldanvil (v0.1.0)**: Dependencies: axios, yaml
    - **@crit-fumble/openai (v0.1.0)**: Not yet implemented
    - **@crit-fumble/next-web (v0.2.0)**: Dependencies: @crit-fumble/core, @crit-fumble/next
    - **Discord packages (@crit-fumble/discord-*)**: All depend only on @crit-fumble/core
- [COMPLETED] Identify dependency violations (packages using deps not in their package.json)
- [COMPLETED] Map out the correct dependency flow between packages
- [COMPLETED] Create a dependency graph to visualize package relationships
- [COMPLETED] Update package naming to use consistent `@crit-fumble/` namespace
- [COMPLETED] Update architecture to have specialized packages imported into @crit-fumble/core

### @crit-fumble/core
- [COMPLETED] Implement config registry
  - Set up proper config type definitions
  - Create centralized registry for config access
  - Implement validation for required environment variables
  - Add proper error handling for missing configs
- [COMPLETED] Fix directory structure for utils (universal/client/server)
- [COMPLETED] Add missing dependencies to package.json:
  - Added `@dice-roller/rpg-dice-roller` (already installed)
  - Added `openai`: Used for AI integration in various commands
- [COMPLETED] Add the following missing dependencies:
  - `chrono-node`: For date parsing in timestamp.js and event.js
- [COMPLETED] Add dependency on @crit-fumble/worldanvil package
- [COMPLETED] Add dependency on @crit-fumble/discord package
- [COMPLETED] Add dependency on @crit-fumble/openai package (placeholder for now)
- [FUTURE] Create schema validation for config types
- [FUTURE] Check for and fix circular dependencies

### @crit-fumble/worldanvil
- [COMPLETED] Create package structure with models/server/client pattern
- [COMPLETED] Implement World Anvil API client
- [COMPLETED] Implement World Anvil models
- [COMPLETED] Implement World Anvil services
- [COMPLETED] Implement World Anvil controllers
- [COMPLETED] Update exports for proper integration with @crit-fumble/core
- [FUTURE] Implement remaining API endpoints
- [FUTURE] Add comprehensive test coverage

### @crit-fumble/openai
- [TODO] Create new package with proper structure
- [TODO] Implement OpenAI API client
- [TODO] Implement models for OpenAI responses
- [TODO] Implement services for different OpenAI features (chat, embeddings, etc.)
- [TODO] Create basic controllers for common OpenAI operations
- [TODO] Set up environment variables and configs

### @crit-fumble/discord
- [FUTURE] Update path aliases for clean and consistent imports
- [FUTURE] Add the following missing dependencies:
  - `@discordjs/voice`: Used in audio.js for voice channel functionality
- [FUTURE] Fix import path in discord-bot/server.js (from `@crit-fumble/discord/services/managers/...` to `@crit-fumble/discord/services/managers/...`)
- [FUTURE] Set up eslint-plugin-import with restrictions (can only import from @crit-fumble/core)

### @crit-fumble/next
- [FUTURE] Fix circular reference in CharacterDashboard (currently imports from `@crit-fumble/next/views/...` which is a self-reference)
- [FUTURE] Fix imports referencing `@crit-fumble/core/config/...` which doesn't exist in the package.json
- [FUTURE] Set up eslint-plugin-import with restrictions (can only import from @crit-fumble/core)
- [FUTURE] Configure tsconfig.json to extend from root configuration

### @crit-fumble/next-web
- [FUTURE] Fix any import violations in the codebase
- [FUTURE] Configure tsconfig.json to extend from root configuration

### @crit-fumble/discord-bot
- [BOT-TODO] Fix import paths that don't match actual file locations
- [FUTURE] Configure tsconfig.json to extend from root configuration
- [FUTURE] Set up CI checks to prevent future violations

### @crit-fumble/discord-app
- [FUTURE] Configure tsconfig.json to extend from root configuration
- [FUTURE] Set up CI checks to prevent future violations

### @crit-fumble/discord-activity
- [FUTURE] Configure tsconfig.json to extend from root configuration
- [FUTURE] Set up CI checks to prevent future violations

### Global Future Improvements
- [FUTURE] Consider splitting pure React code from Next.js code
- [FUTURE] Create a visualization of the architecture for documentation
- [FUTURE] Add automated tests for package boundary violations
- [FUTURE] Document architecture rules in docs/architecture.md
- [FUTURE] Add compiler options to prevent importing non-existent modules
- [FUTURE] Create an import validation script to verify compliance