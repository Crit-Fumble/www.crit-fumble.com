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

## TODO List

### Phase 1: WorldAnvil OAuth Integration [PRIORITY]
1. **Research WorldAnvil OAuth Implementation** [BOT-TODO]
   - Review WorldAnvil API documentation for OAuth2 flow
   - Identify required OAuth endpoints, scopes, and parameters
   - Document differences from Discord OAuth implementation
   - Determine if WorldAnvil follows standard OAuth2 or has custom requirements

2. **Update @crit-fumble/worldanvil Package** [BOT-TODO]
   - Add OAuth2 provider implementation to worldanvil package
   - Implement ISsoProvider interface for WorldAnvil
   - Add OAuth URL generation and token exchange methods
   - Create WorldAnvil user profile mapping
   - Update package version and prepare for publishing

3. **Integrate WorldAnvil OAuth into Core Auth System** [BOT-TODO]
   - Register WorldAnvil provider in AuthService
   - Add WorldAnvil OAuth configuration to auth config
   - Update environment variable documentation
   - Test OAuth flow integration with existing Discord auth

4. **Create WorldAnvil OAuth API Endpoints** [BOT-TODO]
   - Create `/api/worldanvil/oauth/authorize` endpoint
   - Create `/api/worldanvil/oauth/callback` endpoint  
   - Implement session linking for users with existing Discord accounts
   - Add proper error handling and redirects

5. **Update Linked Accounts UI** [BOT-TODO]
   - Remove "Coming Soon" status from WorldAnvil in linked-accounts page
   - Add functional "Connect WorldAnvil" button
   - Show connection status and user info when connected
   - Add disconnect functionality

6. **Test and Deploy WorldAnvil OAuth** [HUMAN-TODO]
   - Configure WorldAnvil Developer Portal with redirect URIs
   - Test OAuth flow in development environment
   - Test OAuth flow in production environment
   - Verify database updates and session management

### Phase 2: Enhanced Authentication Features [FUTURE]
7. **Multi-Provider Account Linking** [BOT-TODO]
   - Allow users to link multiple OAuth providers to single account
   - Handle account merging when user signs in with different providers
   - Add account unlinking functionality
   - Update UI to show all connected providers

8. **OpenAI Integration** [BOT-TODO]
   - Research OpenAI API key management best practices
   - Design secure API key storage (user-provided vs app-level)
   - Create OpenAI connection UI in linked accounts
   - Implement API key validation and testing

### Phase 3: Dashboard Feature Expansion [FUTURE]
9. **Dice Roller Implementation** [BOT-TODO]
   - Create dice rolling logic and API endpoints
   - Design dice roller UI component
   - Add roll history and statistics
   - Support standard RPG dice notation (3d6+2, etc.)

10. **Chat/FumbleBot Integration** [BOT-TODO]
    - Design chat interface for FumbleBot interactions
    - Create chat API endpoints with OpenAI integration
    - Add chat history and session management
    - Implement context-aware responses using user's connected data

11. **Data Dashboard** [BOT-TODO]
    - Create user data visualization components
    - Show connected account statistics and information
    - Display WorldAnvil characters, campaigns, etc.
    - Add data export functionality

### Phase 4: Infrastructure and Quality [ONGOING]
12. **Error Handling and Monitoring** [BOT-TODO]
    - Add comprehensive error logging for OAuth flows
    - Implement monitoring for authentication failures
    - Create user-friendly error pages for auth failures
    - Add retry mechanisms for temporary failures

13. **Security Hardening** [BOT-TODO]
    - Implement CSRF protection for sensitive operations
    - Add rate limiting to OAuth endpoints
    - Review and audit session management security
    - Add security headers and content security policies

14. **Testing and Documentation** [BOT-TODO]
    - Create integration tests for OAuth flows
    - Add unit tests for authentication services
    - Update API documentation with new endpoints
    - Create user guides for account linking

### Completed Items ✅
- ✅ Discord OAuth2 implementation and integration
- ✅ Session management with secure HTTP-only cookies
- ✅ Dashboard navigation structure
- ✅ Linked accounts page foundation
- ✅ Environment configuration for development and production
- ✅ URL redirect fixes for GitHub Codespaces development
- ✅ Logout functionality with proper session clearing
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
