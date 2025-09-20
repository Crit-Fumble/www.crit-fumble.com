# Build Caching and Optimization

This workspace implements advanced build caching and optimization strategies to improve development productivity and CI/CD performance.

## Features

### 🚀 **Incremental Compilation**
- TypeScript incremental builds with `.tsbuildinfo` caching
- Package-level incremental compilation
- Automatic dependency tracking

### 📦 **Smart Package Building**
- Only rebuilds packages that have changed
- Respects dependency order for optimal build sequence
- Git-based change detection for accurate cache invalidation

### ⚡ **Performance Monitoring**
- Build time tracking per package
- Total build time reporting
- Build success/failure statistics

### 🎯 **Intelligent Caching**
- Content-based cache invalidation using Git hashes
- Build manifest tracking for incremental updates
- Separate cache directories to prevent conflicts

## Build Commands

### Primary Build Commands

```bash
# Standard TypeScript project references build
npm run build:all

# Optimized build with caching and change detection
npm run build:optimized

# Force rebuild all packages (ignores cache)
npm run build:force

# Watch mode for development
npm run build:watch

# Verbose build output for debugging
npm run build:verbose
```

### Clean Commands

```bash
# Clean all build outputs
npm run build:clean

# Clean build outputs and cache
npm run clean:cache

# Clean specific package dist directories
npm run clean
```

### Advanced Usage

```bash
# Build specific packages only
node scripts/build-optimized.js build --packages=core,react

# Force rebuild with verbose output
node scripts/build-optimized.js build --force --verbose

# Clean everything including cache
node scripts/build-optimized.js clean --cache
```

## Caching Strategy

### 1. **TypeScript Build Info Caching**
Each package stores its TypeScript build information:
```
packages/core/dist/.tsbuildinfo
packages/react/dist/.tsbuildinfo
packages/next-web/dist/.tsbuildinfo
```

### 2. **Content-Based Change Detection**
The optimized build script uses Git to detect changes:
- Compares current file hashes with cached hashes
- Only rebuilds packages with actual changes
- Respects dependency relationships

### 3. **Build Cache Manifest**
Stored in `.build-cache/manifest.json`:
```json
{
  "lastBuild": "2025-09-16T10:30:00.000Z",
  "packageHashes": {
    "core": "a1b2c3d4e5f6...",
    "react": "f6e5d4c3b2a1...",
    "next-web": "123456789abc..."
  }
}
```

## Performance Optimizations

### **TypeScript Compiler Optimizations**
- `"composite": true` - Enables project references
- `"incremental": true` - Enables incremental compilation
- `"skipLibCheck": true` - Skips type checking of declaration files
- Build info files in `dist/.tsbuildinfo` for faster subsequent builds

### **Build Order Optimization**
Packages are built in optimal dependency order:
1. **worldanvil** (no dependencies)
2. **core** (depends on worldanvil)
3. **react** (depends on core)
4. **next-web** (depends on core & react)

### **Change Detection Optimization**
- Git-based hashing for accurate change detection
- Skips unchanged packages automatically
- Dependency-aware rebuilding (if core changes, react rebuilds too)

## Development Workflow

### Initial Setup
```bash
# First-time build of everything
npm run build:optimized
```

### Daily Development
```bash
# Start watch mode for real-time compilation
npm run build:watch

# In another terminal, start development servers
npm run dev
```

### After Making Changes
```bash
# Optimized incremental build (only rebuilds what changed)
npm run build:optimized

# If you encounter issues, force a clean rebuild
npm run build:force
```

### Troubleshooting Builds
```bash
# Verbose output to debug build issues
npm run build:verbose

# Clean everything and start fresh
npm run clean:cache
npm run build:optimized
```

## CI/CD Integration

### Recommended CI Pipeline
```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Restore build cache
  uses: actions/cache@v3
  with:
    path: .build-cache
    key: build-cache-${{ hashFiles('packages/**/*') }}

- name: Build packages
  run: npm run build:optimized

- name: Run tests
  run: npm test
```

### Build Cache Benefits in CI
- **Faster builds**: Only changed packages are rebuilt
- **Reduced resource usage**: Fewer CPU cycles and build time
- **Parallel execution**: Independent packages can build simultaneously
- **Reliable caching**: Git-based hashing ensures cache accuracy

## Monitoring and Debugging

### Build Performance Metrics
The optimized build script provides detailed metrics:
- Individual package build times
- Total build duration
- Cache hit/miss rates
- Success/failure statistics

### Debug Build Issues
```bash
# Show verbose TypeScript compiler output
npm run build:verbose

# Check what packages would be rebuilt
node scripts/build-optimized.js build --dry-run

# Force rebuild a specific package
node scripts/build-optimized.js build --packages=core --force
```

### Cache Management
```bash
# View cache manifest
cat .build-cache/manifest.json

# Clear cache if corrupted
npm run clean:cache

# Rebuild cache
npm run build:optimized
```

## Best Practices

### 🎯 **For Developers**
1. Use `npm run build:optimized` for regular builds
2. Use `npm run build:watch` during active development
3. Run `npm run clean:cache` if builds behave unexpectedly
4. Check build times with verbose output to identify bottlenecks

### 🏗️ **For CI/CD**
1. Cache the `.build-cache` directory between builds
2. Use `npm run build:optimized` for production builds
3. Monitor build performance metrics over time
4. Set up notifications for build time regressions

### 🔧 **For Package Maintenance**
1. Keep `tsconfig.json` files optimized with incremental settings
2. Avoid circular dependencies that break build optimization
3. Use TypeScript project references correctly
4. Regular cleanup of unused dependencies

## Troubleshooting

### Common Issues

**"Build cache corrupted"**
- Solution: Run `npm run clean:cache` and rebuild

**"Incremental build not working"**
- Check that `.tsbuildinfo` files exist in `dist/` directories
- Verify `"incremental": true` in package tsconfig files

**"Packages building in wrong order"**
- Check TypeScript project references in each package
- Verify dependency order in root tsconfig.json

**"Git hash detection failing"**
- Ensure you're in a Git repository
- Check that Git is installed and accessible

### Performance Tips

1. **Use SSD storage** for faster file I/O during builds
2. **Increase Node.js memory** if building large packages: `--max-old-space-size=4096`
3. **Enable parallel builds** in CI environments with multiple cores
4. **Monitor build cache size** and clean periodically if it grows too large

## Future Enhancements

- **Parallel package building** for independent packages
- **Distributed caching** for shared development environments
- **Build time visualization** and bottleneck analysis
- **Automatic dependency graph optimization**
- **Integration with bundler caching** (Webpack, Vite, etc.)