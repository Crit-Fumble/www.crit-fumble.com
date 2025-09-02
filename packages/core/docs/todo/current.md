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

### @crit-fumble/worldanvil
- [COMPLETED] Create package structure with models/server/client pattern
- [COMPLETED] Implement World Anvil API client
- [COMPLETED] Implement World Anvil models
- [COMPLETED] Implement World Anvil services
- [COMPLETED] Implement World Anvil controllers
- [COMPLETED] Update exports for proper integration with @crit-fumble/core
- [BOT-WIP] Implement remaining API endpoints
- [BOT-WIP] Add comprehensive test coverage
- [BOT-TODO] remove all completed FUTURE: and TODO: comments

### @crit-fumble/openai
- [COMPLETED] Create new package with proper structure
- [COMPLETED] Implement OpenAI API client
- [COMPLETED] Implement models for OpenAI responses
- [COMPLETED] Implement services for different OpenAI features (chat, embeddings, etc.)
- [COMPLETED] Create basic controllers for common OpenAI operations
- [COMPLETED] Set up environment variables and configs
- [COMPLETED] Add comprehensive test coverage
- [BOT-TODO] update configs to simply accept a value instead of reading from .env
- [BOT-TODO] implement SSO
- [BOT-TODO] remove all completed FUTURE: and TODO: comments

### @crit-fumble/discord
- [COMPLETED] update package structure to match openai and worldanvil libraries
- [COMPLETED] Set up eslint-plugin-import with restrictions (can only import from @crit-fumble/core)
- [COMPLETED] update exports for proper integration with @crit-fumble/core
- [COMPLETED] Create basic controllers for common Discord operations
- [COMPLETED] Set up environment variables and configs
- [COMPLETED] Add comprehensive test coverage
- [BOT-TODO] remove all completed FUTURE: and TODO: comments

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
- [BOT-TODO] link discord and worldanvil services in UserController, WorldController, and RpgSystemController in packages\core\server\controllers
- [BOT-TODO] implement a "Marketplace" currency system "Crit-Coins" in packages\core\server\services\coinService.ts; the name of the  coins can be determined in a config we will pass in from the host project; we need methods to add and remove coins; we will build a wrapper package for stripe to handle the payment processing in the future, but we will want some methods we can use during the testing phase to give our coins for free
- [BOT-TODO] create a server controller for the coinService in packages\core\server\controllers\coinController.ts
- [FUTURE] Create schema validation for config types
- [FUTURE] Check for and fix circular dependencies
- [BOT-TODO] remove all completed FUTURE: and TODO: comments

### @crit-fumble/next
- [BOT-TODO] update package structure to match other libraries
- [BOT-TODO] Set up eslint-plugin-import with restrictions (can only import from @crit-fumble/core)
- [BOT-TODO] Configure tsconfig.json to extend from root configuration
- [BOT-TODO] remove all completed FUTURE: and TODO: comments

### @crit-fumble/next-web
- [BOT-TODO] Fix any import violations in the codebase
- [BOT-TODO] Configure tsconfig.json to NOT extend from a root configuration
- [BOT-TODO] Set up an api endpoint collection for use with the discord-bot we'll be updating later in packages\discord-bot
- [BOT-TODO] Set up an api endpoint collection for use by a Discord App
- [BOT-TODO] Set up a special view for the discord activity
- [BOT-TODO] remove all completed FUTURE: and TODO: comments

### @crit-fumble/discord-bot
- [BOT-TODO] Fix import paths that don't match actual file locations
- [BOT-TODO] Configure tsconfig.json to NOT extend from a root configuration
- [BOT-TODO] Update bot to use website endpoints for command execution
- [BOT-TODO] Update bot to use website endpoints for event handling
- [BOT-TODO] Update bot to use website endpoints for user authentication
- [BOT-TODO] Ensure persistent bot is processing scheduled cron tasks
- [BOT-TODO] Set up CI checks to prevent future violations
- [BOT-TODO] remove all completed FUTURE: and TODO: comments

### Future Library Packages
- [FUTURE] Scope out a package for wrapping Stripe payments
- [FUTURE] Scope out package for Roll20 Integration
- [FUTURE] Scope out a package for a FoundryVTT integration
- [FUTURE] Scope out a Docker instance manager using Docker and either fly.io or vast.ai to deploy images
- [FUTURE] Scope out a FoundryVTT instance manager using Docker
- [FUTURE] Scope out package for Steam integration, with an instance manager using Docker for hosting game servers
- [FUTURE] Scope out package for Twitch integration
- [FUTURE] Scope out package for YouTube integration
- [FUTURE] Consider splitting pure React code from Next.js code into a 'react' library


### Global Future Improvements
- [FUTURE] Create a visualization of the architecture for documentation
- [FUTURE] Add automated tests for package boundary violations
- [FUTURE] Document architecture in docs/architecture.md
- [FUTURE] Add compiler options to prevent importing non-existent modules
- [FUTURE] Create an import validation script to verify compliance