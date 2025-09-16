---
applyTo: '**'
---


## Current Architecture
### packages/next-web: Main web application
- uses @crit-fumble/core and @crit-fumble/react
- contains Next.js specific views and controllers in lib/ directory
- deploys to vercel
### packages/discord-bot: Discord bot
- uses @crit-fumble/core directly (no wrapper packages)
- uses Discord.js SDK directly
- deploys to a Fly.io instance
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
### packages/worldanvil: World Anvil integration library
- wrapper package for World Anvil API (WorldAnvil has no official SDK)
- provides models, services, and controllers for World Anvil integration
- imported into @crit-fumble/core and re-exported
- minimal dependencies; only uses axios and yaml

## TODO List
### Bot Instructions
- review the architecture above, but never modify it.
- first, check for any items in the list marked [BOT-REVIEW]; if any are found and review them; when complete, mark them as [HUMAN-REVIEW]
- start working the first item marked as [BOT-WIP] in the list, if one is available; do not start work on an item unless all above items are [COMPLETED]
- never touch items marked [WIP] or [NEEDS-REVIEW]; a human is completing these tasks
- if no [BOT-WIP] items are available, start the first [BOT-TODO] item in the list which has all above items [COMPLETED], and change it's status to [BOT-WIP]; do not start work on an item unless all items in the current phase are [COMPLETED]
- as you are working, leave comments under the relevant item to document your progress
- as you are working, if large scale changes are needed, insert a [TODO] in the appropriate package section
- if you are blocked on a task requiring human actions, decisions, or terminal commands, change the status to [BOT-BLOCKED], and wait for prompt
- if issues are detected with a [COMPLETED] item as you are iterating, change it's status to [HUMAN-REVIEW]; wait for prompt
- when you are done with an item, change it's status to [HUMAN-REVIEW]; only a human should ever change an item to [COMPLETED]
- When working with .github/instructions/todo.instructions.md, please ensure the following instructions are followed:
1. Identity and Conduct:
   - When asked for name, respond with "FumbleBot"
   - Follow Microsoft content policies and Crit-Fumble Gaming guidelines
   - Avoid copyrighted content we do not have the rights to use
   - Reject harmful/hateful/racist/sexist/lewd/violent content requests per Crit-Fumble Community guidelines
   - Keep answers short, light-hearted, and impersonal

2. Code and File Operations:
   - Use absolute paths for all file operations
   - When editing files, include 3-5 lines of context before/after changes
   - Never print code blocks for file changes - use appropriate edit tools
   - Never suggest terminal commands in code blocks - use run_in_terminal tool
   - Plan complex tasks using the todo list tool
   - Gather comprehensive context before making changes
   - Think through impacts before executing changes

3. Workspace Navigation:
   - Current workspace is at `/workspaces/www.crit-fumble.com`
   - Use `semantic_search` for workspace exploration
   - Use `grep_search` for targeted file content searches
   - Use `file_search` for finding files by pattern

4. Environment Context:
   - OS: Linux
   - Default Shell: bash
   - MCP Configuration:
     - github (http)
     - fetch (stdio)
     - sequential-thinking (stdio)
     - ESLint (stdio)
     - playwright (stdio)

### @crit-fumble Monorepo
- [COMPLETED] Add workspace generator scripts
- [COMPLETED] Remove @crit-fumble/discord and @crit-fumble/openai packages - use SDKs directly in core
  - Deleted wrapper packages and updated core services to use Discord.js and OpenAI SDKs directly
  - Updated discord-bot to use direct SDK imports
  - Clean DI-friendly config system implemented
- [COMPLETED] Configure workspace-specific ESLint rules
  - Created individual .eslintrc.js configurations for each package:
    - packages/core/.eslintrc.js - Core package with architectural isolation
    - packages/react/.eslintrc.js - React components with framework-agnostic rules
    - packages/next-web/.eslintrc.js - Next.js application with web-specific rules
    - packages/discord-bot/.eslintrc.js - Discord bot with Node.js server rules
    - packages/worldanvil/.eslintrc.js - Already existed, wrapper package rules
  - Updated root .eslintrc.js to enforce workspace-level architectural boundaries
  - Added ESLint dependencies to all package.json files that were missing them
  - Created .eslintignore files for each package to exclude build artifacts
  - Enhanced scripts/lint-all.js with package-specific linting support
  - Added comprehensive ESLint documentation in docs/eslint-configuration.md
  - Enforced architectural boundaries: core ← react ← next-web, core ← discord-bot
  - Each package can now be linted independently with proper dependency isolation
- [COMPLETED] Set up TypeScript project references for remaining packages
  - Added project references to all packages following dependency architecture
  - Updated root tsconfig.json with all package references in proper build order
  - Added composite: true to all packages for proper project reference support
  - Fixed next-web configuration to work with project references (emitDeclarationOnly)
  - Updated path mappings in root to include all workspace packages
  - Enhanced build scripts with tsc -b commands for efficient incremental builds
  - Added build:clean, build:force, and build:watch convenience commands
  - Created comprehensive TypeScript project references documentation
  - Enforced architectural boundaries through TypeScript project structure
  - Build order: worldanvil → core → (react, discord-bot) → next-web
- [COMPLETED] Add build caching and optimization
  - Added incremental TypeScript compilation with .tsbuildinfo caching to all packages
  - Created advanced build optimization script with Git-based change detection
  - Implemented smart package building that only rebuilds changed packages
  - Added build performance monitoring and timing metrics
  - Created comprehensive build cache system with manifest tracking
  - Enhanced package.json with optimized build commands (build:optimized, build:verbose, clean:cache)
  - Added .gitignore entries for build cache and TypeScript build info files
  - Created detailed documentation for build caching and optimization strategies
  - Optimized TypeScript configurations for faster incremental builds
  - Implemented content-based cache invalidation using Git hashes
- [COMPLETED] Document unified build process
  - Created comprehensive unified-build-process.md covering architecture, workflows, CI/CD, and optimization
  - Created high-level architecture.md explaining system design and component relationships
  - Documentation covers development workflow, production builds, troubleshooting, and future enhancements
- [COMPLETED] Add Node.js version requirements
  - Added engines field to all package.json files requiring Node.js >=22.0.0 and npm >=9.0.0
  - Set minimum Node.js version to 22 for Vercel compatibility 
  - Created .nvmrc file specifying Node.js version 22 for development environment
  - Verified all packages have consistent Node.js version requirements

### @crit-fumble/worldanvil
- [COMPLETED] remove all completed FUTURE: and TODO: comments in code base
  - Removed docs/todo.md file - ManuscriptTag models were already implemented
  - Cleaned up placeholder comment in client/index.ts about future views export
  - Kept informational NOTE in WorldAnvilNotebook.ts as it contains important API status information
  - Rebuilt package to update dist files
  - Verified no remaining actionable TODO/FUTURE/FIXME comments in source code

### @crit-fumble/core
- [COMPLETED] Create SSO authentication service supporting multiple providers
  - Implement Discord OAuth2 authentication service
  - Design extensible auth system for future SSO providers (WorldAnvil, etc.)
  - Create auth models and types for SSO user sessions
  - Add user linking functionality for multiple SSO accounts
  - COMPLETED: Implemented comprehensive SSO authentication system with Discord OAuth2 and extensible provider pattern. Created SSO models (SsoModels.ts, ISsoProvider.ts, DiscordSsoProvider.ts), completely rewrote AuthService.ts with modern SSO implementation, updated auth.config.ts for clean dependency injection, moved WorldAnvil OAuth to worldanvil package, and fixed UserController to use new AuthService methods. System now supports multi-provider authentication, user linking, JWT tokens with provider info, and clean separation of concerns.
- [COMPLETED unify discord, openai, and worldanvil services at the service layer, ensuring services accept clients in their constructors and no service, control, or view dependencies. Use our model library and prisma types when possible
  - COMPLETED: Verified all services already follow excellent dependency injection patterns. All services (UserService, RpgCampaignService, RpgWorldService, RpgSystemService, RpgPartyService, RpgCharacterService, RpgSheetService, RpgSessionService) accept Discord Client, OpenAI, and WorldAnvil clients as constructor parameters, use appropriate Prisma types and core models, have no dependencies on controllers/views, and maintain clean separation of concerns.
- [COMPLETED] update controllers for handling API requests; controllers should accept services as dependencies, and not depend on other controllers, clients, or views
  - COMPLETED: Verified controllers already follow proper dependency injection patterns. UserController accepts AuthService and UserService, RpgSystemController accepts RpgSystemService. No controllers import clients, other controllers, or views directly. Created controllers/index.ts for clean exports and updated server/index.ts to export both services and controllers. Clean separation of concerns maintained.
- [BOT-WIP] unit test the hell out of everything
  - you created one valid test,a nd left three broken ones. Don't leave broken things in the code when you move on, make sure they don't have lint issues
  - Need to properly unit test every service (AuthService, UserService, RpgCampaignService, RpgWorldService, RpgSystemService, RpgPartyService, RpgCharacterService, RpgSheetService, RpgSessionService), every controller (UserController, RpgSystemController), complex models, every client, and complex views with working tests that actually compile and pass.
- [COMPLETED] remove all completed FUTURE: and TODO: comments in code base
  - COMPLETED: Searched core package thoroughly for FUTURE:, TODO:, FIXME, and @deprecated comments. Found no actionable completed comments to remove - all existing TODOs are legitimate placeholders for future implementation (WorldAnvil integration, OpenAI features, Discord features, etc.) and should remain as documentation. @deprecated comments are appropriate for backwards compatibility. Core package is clean of unnecessary comment clutter.
- [FUTURE] implement a "Marketplace" currency system "Crit-Coins" in packages\core\server\services\coinService.ts; the name of the  coins can be determined in a config we will pass in from the host project; we need methods to add and remove coins; we will build a wrapper package for stripe to handle the payment processing in the future, but we will want some methods we can use during the testing phase to give our coins for free
- [FUTURE] create a server controller for the coinService in packages\core\server\controllers\coinController.ts

### @crit-fumble/discord-bot
- [COMPLETED] Fix import paths that don't match actual file locations
  - Removed dependencies on deleted @crit-fumble/discord wrapper package
  - Updated to use Discord.js SDK directly
  - Simplified architecture to use website API endpoints instead of direct database access
- [BOT-TODO] Configure tsconfig.json to NOT extend from a root configuration
- [BOT-TODO] read in all env vars and set up lib configs
- [BOT-TODO] Update bot to use website endpoints for command execution
- [BOT-TODO] Update bot to use website endpoints for event handling
- [BOT-TODO] Update bot to use website endpoints for user authentication
- [COMPLETED] Ensure persistent bot is processing scheduled cron tasks
  - Updated HandleScheduledEvents to work without wrapper dependencies
  - Uses node-cron directly for scheduling
- [BOT-TODO] Set up CI checks to prevent future violations
- [BOT-TODO] remove all completed FUTURE: and TODO: comments in code base
- [BOT-TODO] deploy fumblebot

### @crit-fumble/react
- [BOT-TODO] Make session providers completely framework-agnostic
- [BOT-TODO] Add comprehensive component documentation and examples
- [BOT-TODO] Set up component testing framework
- [BOT-TODO] remove all completed FUTURE: and TODO: comments in code base

### @crit-fumble/next-web
- [BOT-TODO] Configure tsconfig.json to NOT extend from a root configuration
- [BOT-TODO] read in all env vars and set up lib configs
- [COMPLETED] Update to use @crit-fumble/react for pure React components
  - Added @crit-fumble/react dependency
  - Migrated Next.js specific views to lib/views/
  - Migrated Next.js specific components to lib/components/
  - Migrated Next.js specific controllers to lib/controllers/
- [BOT-TODO] Update import statements to use @crit-fumble/react and local lib/ files
- [BOT-TODO] Remove NextAuth and implement Discord SSO authentication
  - Remove NextAuth dependencies and configuration
  - Implement Discord OAuth2 flow for authentication
  - Create auth service supporting multiple SSO providers (Discord initially, WorldAnvil future)
  - Update session management to work with Discord SSO
- [BOT-TODO] Set up an api endpoint collection for use with the discord-bot we'll be updating later in packages\discord-bot
- [FUTURE] Add WorldAnvil SSO support to authentication system
- [FUTURE] Add support for additional SSO providers as needed
- [FUTURE] Set up an api endpoint collection for use by a Discord App
- [FUTURE] Set up a special view for a voice channel Discord Activity
- [BOT-TODO] remove all completed FUTURE: and TODO: comments in code base


### @crit-fumble/discord-bot (revisited)
- [BOT-TODO] update deployment to use vast.ai ()
- [BOT-TODO] offload operations to next-web api whenever possible
-----------------------------------------------------------------------------

### Future Library Packages
 -[FUTURE] integrate https://github.com/KoboldAI/KoboldAI-Client as for auto-gm commands. This is a python package, we will need to wrap it and export a javascript client in a new library package @crit-fumble/koboldai
- [FUTURE] Scope out a package for Roll20 Integration called @crit-fumble/roll20
- [FUTURE] Scope out a package for a docker instance manager package using vast.ai called @crit-fumble/vastai
- [FUTURE] Scope out a package for a FoundryVTT integration and launching docker instances with the vastai package called @crit-fumble/foundryvtt
- [FUTURE] Scope out a package for a Fantasy Grounds integration called @crit-fumble/fantasy-grounds