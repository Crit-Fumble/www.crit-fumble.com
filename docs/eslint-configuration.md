# ESLint Configuration Documentation

This workspace uses a layered ESLint configuration approach with workspace-specific rules to enforce architectural boundaries and maintain code quality across all packages.

## Configuration Structure

### Root Configuration (/.eslintrc.js)
- Provides workspace-level linting for root files and scripts
- Enforces architectural boundaries between packages
- Shared rules and settings for all packages

### Package-Specific Configurations
Each package has its own `.eslintrc.js` file tailored to its specific needs:

#### @crit-fumble/core (packages/core/.eslintrc.js)
- **Purpose**: Shared data models, services, and utilities
- **Dependencies**: Can only import from `@crit-fumble/worldanvil`
- **Environment**: Node.js
- **Special Rules**: 
  - Enforces isolation from other packages
  - Allows worldanvil imports only

#### @crit-fumble/react (packages/react/.eslintrc.js)
- **Purpose**: Framework-agnostic React components and hooks
- **Dependencies**: Can only import from `@crit-fumble/core`
- **Environment**: Browser
- **Special Rules**:
  - React-specific linting
  - React hooks enforcement
  - No Next.js dependencies allowed

#### @crit-fumble/next-web (packages/next-web/.eslintrc.js)
- **Purpose**: Next.js web application
- **Dependencies**: Can import from `@crit-fumble/core` and `@crit-fumble/react`
- **Environment**: Browser + Node.js
- **Special Rules**:
  - Next.js-specific linting
  - React and Next.js optimizations
  - Web performance rules

#### @crit-fumble/discord-bot (packages/discord-bot/.eslintrc.js)
- **Purpose**: Discord bot application
- **Dependencies**: Can only import from `@crit-fumble/core`
- **Environment**: Node.js
- **Special Rules**:
  - Server-side optimizations
  - Discord.js best practices

#### @crit-fumble/worldanvil (packages/worldanvil/.eslintrc.js)
- **Purpose**: World Anvil API wrapper
- **Dependencies**: No internal dependencies (wrapper package)
- **Environment**: Node.js
- **Special Rules**:
  - API wrapper patterns
  - External API best practices

## Architectural Boundaries

The ESLint configuration enforces these architectural rules:

```
┌─────────────────┐    ┌──────────────────┐
│   next-web      │    │   discord-bot    │
│                 │    │                  │
│ ┌─────────────┐ │    │                  │
│ │   react     │ │    │                  │
│ │             │ │    │                  │
│ │ ┌─────────┐ │ │    │ ┌──────────────┐ │
│ │ │  core   │◄┼─┼────┼─┤     core     │ │
│ │ │         │ │ │    │ │              │ │
│ │ │ ┌─────┐ │ │ │    │ │ ┌──────────┐ │ │
│ │ │ │ WA  │ │ │ │    │ │ │    WA    │ │ │
│ │ │ └─────┘ │ │ │    │ │ └──────────┘ │ │
│ │ └─────────┘ │ │    │ └──────────────┘ │
│ └─────────────┘ │    │                  │
└─────────────────┘    └──────────────────┘

Legend: WA = @crit-fumble/worldanvil
```

## Usage

### Linting All Packages
```bash
npm run lint:all
```

### Linting Specific Packages
```bash
npm run lint:all core           # Lint only core
npm run lint:all core react     # Lint core and react
```

### Linting Individual Packages
```bash
cd packages/core && npm run lint
cd packages/react && npm run lint
# etc.
```

## Package Scripts

Each package includes a `lint` script in its `package.json`:
- `npm run lint` - Runs ESLint with the package-specific configuration
- Configurations automatically exclude build artifacts and node_modules

## Dependencies

The following ESLint dependencies are installed:

### Root Level
- `eslint` - Core ESLint
- `@typescript-eslint/eslint-plugin` - TypeScript support
- `@typescript-eslint/parser` - TypeScript parser
- `eslint-plugin-import` - Import/export linting
- `eslint-plugin-react` - React-specific rules
- `eslint-plugin-react-hooks` - React hooks rules

### Package Level
Each package includes the necessary ESLint dependencies in its `devDependencies` to support independent development and CI.

## Configuration Files

### .eslintrc.js Files
- Root: Workspace-level configuration and architectural boundaries
- Packages: Package-specific rules and environment settings

### .eslintignore Files
Each package includes an `.eslintignore` file that excludes:
- `dist/` - Build output
- `node_modules/` - Dependencies
- `*.d.ts` - Type definitions
- `*.js.map` - Source maps
- `coverage/` - Test coverage
- `.next/` - Next.js build cache
- `.vercel/` - Vercel deployment files

## Custom Rules

### Import Ordering
All packages enforce consistent import ordering:
1. Built-in Node.js modules
2. External dependencies
3. Internal @crit-fumble packages
4. Parent directory imports
5. Sibling directory imports
6. Index files

### Architectural Boundaries
- **Core isolation**: Core package cannot import from other packages (except worldanvil)
- **React purity**: React package can only use React and core
- **Application boundaries**: Applications (next-web, discord-bot) have clearly defined dependencies

### Code Quality
- TypeScript strict mode enforcement
- Unused variable detection
- Console.log warnings (allows warn, error, info, debug)
- Consistent equality checks (===)
- Modern JS practices (const over var)

## Troubleshooting

### Common Issues

1. **"Cannot import from restricted path"**
   - Check if you're importing from a package not allowed by the architectural boundaries
   - Verify the import is from an allowed dependency

2. **"TypeScript project not found"**
   - Ensure each package has a valid `tsconfig.json`
   - Check that the TypeScript project reference is correct

3. **"Import not found"**
   - Verify the imported file exists
   - Check the import path is correct
   - Ensure the package is built if importing from dist

### Performance Considerations

- Each package runs ESLint independently for faster feedback
- Workspace-level rules are cached across packages
- Use `--max-warnings 0` in CI to treat warnings as errors