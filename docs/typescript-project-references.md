# TypeScript Project References Configuration

This workspace uses TypeScript project references to enable efficient builds, better IDE support, and proper dependency management across packages.

## Project Structure

### Dependency Graph
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

### Build Order
1. **worldanvil** - No dependencies (wrapper package)
2. **core** - Depends on worldanvil
3. **react** - Depends on core
4. **discord-bot** - Depends on core
5. **next-web** - Depends on core and react

## Configuration

### Root tsconfig.json
- **Purpose**: Orchestrates all package builds
- **References**: All workspace packages in dependency order
- **Path mappings**: Provides workspace-wide type resolution

### Package tsconfig.json Files

#### Common Settings
All packages extend the root configuration and include:
- `"composite": true` - Enables project references
- `"declaration": true` - Generates .d.ts files for consumers
- `"outDir": "dist"` - Consistent output directory

#### Package-Specific Configurations

**@crit-fumble/worldanvil**
- No internal references (external wrapper)
- Standard Node.js library build

**@crit-fumble/core**
- References: worldanvil
- Includes: models, server, client, utils, prisma

**@crit-fumble/react**
- References: core
- JSX configuration for React components
- Browser environment settings

**@crit-fumble/discord-bot**
- References: core
- Node.js server environment
- Bot-specific paths

**@crit-fumble/next-web**
- References: core, react
- Next.js-specific configuration
- `emitDeclarationOnly: true` (Next.js handles build)

## Build Commands

### Primary Commands
```bash
npm run build:all      # Build all packages in dependency order
npm run build:clean    # Clean all build outputs
npm run build:force    # Force rebuild all packages
npm run build:watch    # Watch mode for development
```

### Package-Specific Builds
```bash
cd packages/core && npm run build        # Build single package
cd packages/react && npm run build       # Build with dependencies
```

## Benefits

### 1. **Incremental Builds**
- Only rebuilds changed packages and their dependents
- Significant speed improvements in large codebases

### 2. **Better IDE Support**
- Go-to-definition works across packages
- Accurate error reporting
- IntelliSense for internal dependencies

### 3. **Type Safety**
- Ensures packages are built before their consumers
- Catches interface changes at build time
- Proper declaration file generation

### 4. **Dependency Management**
- Enforces build order based on actual dependencies
- Prevents circular dependencies
- Clear architectural boundaries

## Development Workflow

### Initial Setup
```bash
npm run build:all      # Build everything once
```

### Development
```bash
npm run build:watch    # Start watch mode
# In another terminal
npm run dev            # Start development servers
```

### Clean Builds
```bash
npm run build:clean    # Clean everything
npm run build:all      # Rebuild from scratch
```

## Path Mappings

The root tsconfig.json provides path mappings for all packages:

```json
{
  "paths": {
    "@crit-fumble/core/*": ["./packages/core/*"],
    "@crit-fumble/react/*": ["./packages/react/*"],
    "@crit-fumble/worldanvil/*": ["./packages/worldanvil/*"]
  }
}
```

This enables clean imports across packages:
```typescript
import { SomeModel } from '@crit-fumble/core/models';
import { Button } from '@crit-fumble/react/components';
```

## Troubleshooting

### Common Issues

1. **"Referenced project may not disable emit"**
   - Ensure `noEmit: false` in all referenced packages
   - For Next.js apps, use `emitDeclarationOnly: true`

2. **"Project references are not supported"**
   - Verify `"composite": true` in all package tsconfigs
   - Check that references point to valid tsconfig.json files

3. **Build order issues**
   - Verify dependency order in root references array
   - Ensure package references match actual dependencies

4. **Type resolution errors**
   - Check path mappings in root tsconfig.json
   - Verify package names match in package.json files

### Performance Tips

- Use `--incremental` flag for faster subsequent builds
- Use `--watch` mode during development
- Run `--clean` when switching branches or major changes
- Consider `--force` if you encounter stale build issues

## Integration with Tools

### ESLint
Each package has its own ESLint configuration that works with TypeScript project references.

### Jest
Test configurations respect the project reference structure for proper module resolution.

### Next.js
Special handling for Next.js apps that don't emit JavaScript but still participate in the reference graph for type checking.