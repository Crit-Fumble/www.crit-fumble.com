## Current Architecture
### packages/next-web: Main web application
- uses @cfg/core and @cfg/next
- deploys to vercel
### packages/discord-bot: Discord bot
- uses @cfg/core
- deploys to a Fly.io instance
### packages/discord-app: Discord app
- uses @cfg/core
- deployment details pending
### packages/discord-activity: Discord activity
- uses @cfg/core
- deployment details pending
### packages/core: Core models, utils, and Prisma wrapper
- reads environment variables from .env files of the package it's installed into
- wraps @prisma/client, @vercel/blob, and other shared packages
- imports and re-exports @cfg/discord, @cfg/worldanvil, and @cfg/openai
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
- minimal back end dependencies; prefer @cfg/core
### packages/discord: Discord integration library
- reads environment variables from .env files of the package it's installed into
- wraps discord.js
- imported into @cfg/core and re-exported
- minimal dependencies; only ones required for discord packages
### packages/worldanvil: World Anvil integration library
- wraps World Anvil API
- provides models, services, and controllers for World Anvil integration
- imported into @cfg/core and re-exported
- minimal dependencies; only uses axios and yaml
### packages/openai: OpenAI integration library
- wraps OpenAI API
- provides services for AI-powered features
- imported into @cfg/core and re-exported
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
    - **@cfg/core (v6.8.2)**: Dependencies: @prisma/client, @vercel/blob, @cfg/discord, @cfg/worldanvil, @cfg/openai
    - **@cfg/next (v14.2.14)**: Dependencies: next, next-auth, react, react-dom, react-hook-form, react-hot-toast
    - **@cfg/discord (v14.14.1)**: Dependencies: discord.js, @napi-rs/canvas, dotenv, node-cron, node-fetch
    - **@cfg/worldanvil (v0.1.0)**: Dependencies: axios, yaml
    - **@cfg/openai (v0.1.0)**: Not yet implemented
    - **@cfg/next-web (v0.2.0)**: Dependencies: @cfg/core, @cfg/next
    - **Discord packages (@cfg/discord-*)**: All depend only on @cfg/core
- [COMPLETED] Identify dependency violations (packages using deps not in their package.json)
- [COMPLETED] Map out the correct dependency flow between packages
- [COMPLETED] Create a dependency graph to visualize package relationships
- [COMPLETED] Update package naming to use consistent `@cfg/` namespace
- [COMPLETED] Update architecture to have specialized packages imported into @cfg/core

### @cfg/core
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
- [COMPLETED] Add dependency on @cfg/worldanvil package
- [COMPLETED] Add dependency on @cfg/discord package
- [COMPLETED] Add dependency on @cfg/openai package (placeholder for now)
- [FUTURE] Create schema validation for config types
- [FUTURE] Check for and fix circular dependencies

### @cfg/worldanvil
- [COMPLETED] Create package structure with models/server/client pattern
- [COMPLETED] Implement World Anvil API client
- [COMPLETED] Implement World Anvil models
- [COMPLETED] Implement World Anvil services
- [COMPLETED] Implement World Anvil controllers
- [COMPLETED] Update exports for proper integration with @cfg/core
- [FUTURE] Implement remaining API endpoints
- [FUTURE] Add comprehensive test coverage

### @cfg/openai
- [TODO] Create new package with proper structure
- [TODO] Implement OpenAI API client
- [TODO] Implement models for OpenAI responses
- [TODO] Implement services for different OpenAI features (chat, embeddings, etc.)
- [TODO] Create basic controllers for common OpenAI operations
- [TODO] Set up environment variables and configs

### @cfg/discord
- [FUTURE] Update path aliases for clean and consistent imports
- [FUTURE] Add the following missing dependencies:
  - `@discordjs/voice`: Used in audio.js for voice channel functionality
- [FUTURE] Fix import path in discord-bot/server.js (from `@cfg/discord/services/managers/...` to `@cfg/discord/services/managers/...`)
- [FUTURE] Set up eslint-plugin-import with restrictions (can only import from @cfg/core)

### @cfg/next
- [FUTURE] Fix circular reference in CharacterDashboard (currently imports from `@cfg/next/views/...` which is a self-reference)
- [FUTURE] Fix imports referencing `@cfg/core/config/...` which doesn't exist in the package.json
- [FUTURE] Set up eslint-plugin-import with restrictions (can only import from @cfg/core)
- [FUTURE] Configure tsconfig.json to extend from root configuration

### @cfg/next-web
- [FUTURE] Fix any import violations in the codebase
- [FUTURE] Configure tsconfig.json to extend from root configuration

### @cfg/discord-bot
- [BOT-TODO] Fix import paths that don't match actual file locations
- [FUTURE] Configure tsconfig.json to extend from root configuration
- [FUTURE] Set up CI checks to prevent future violations

### @cfg/discord-app
- [FUTURE] Configure tsconfig.json to extend from root configuration
- [FUTURE] Set up CI checks to prevent future violations

### @cfg/discord-activity
- [FUTURE] Configure tsconfig.json to extend from root configuration
- [FUTURE] Set up CI checks to prevent future violations

### Global Future Improvements
- [FUTURE] Consider splitting pure React code from Next.js code
- [FUTURE] Create a visualization of the architecture for documentation
- [FUTURE] Add automated tests for package boundary violations
- [FUTURE] Document architecture rules in docs/architecture.md
- [FUTURE] Add compiler options to prevent importing non-existent modules
- [FUTURE] Create an import validation script to verify compliance