# 5e Compendium Sync Script Documentation

## Overview

The `sync5eCompendium.js` script imports D&D 5e data from the D&D 5e API and stores it in the local file system using a structure that mirrors the API paths. It supports both the 2014 and 2024 versions of the D&D 5e SRD API.

## How It Works

1. The script reads the game system definition from `public/gameSystemDefinitions/5e/5eDefinition.json`
2. It identifies API versions and base URLs from the compendium entries
3. For each API version, it reads the corresponding `index.json` file in the API directory
4. It processes each endpoint listed in the index file, respecting existing records and timestamps
5. When processing an endpoint:
   - If the endpoint already exists and has an `updated_at` timestamp, it is skipped
   - Otherwise, the script fetches the data from the API and writes it to the file system
   - For list endpoints (with `results` array), each item is also processed individually

## Running the Script

### Basic Usage

```
node scripts/sync5eCompendium.js
```

This will process all API versions and endpoints listed in the index files, skipping any that already have an `updated_at` timestamp.

### Command Line Options

#### Force Update

```
node scripts/sync5eCompendium.js --force
```

The `--force` option ignores existing timestamps and processes all endpoints, even if they already have an `updated_at` timestamp.

#### Select Specific API Version

```
node scripts/sync5eCompendium.js --version=2014
node scripts/sync5eCompendium.js --version=2024
```

This will only process the specified API version.

#### Select Specific Endpoints

```
node scripts/sync5eCompendium.js --endpoint=spells
node scripts/sync5eCompendium.js --endpoint=classes
```

This will only process endpoints that include the specified string. Multiple endpoints can be specified:

```
node scripts/sync5eCompendium.js --endpoint=spells --endpoint=classes
```

#### Combining Options

Options can be combined:

```
node scripts/sync5eCompendium.js --version=2014 --endpoint=spells --force
```

This will force-update all spell-related endpoints in the 2014 API version.

## File Structure

The script stores data in the following directory structure:

```
public/
  gameSystemDefinitions/
    5e/
      compendium/
        api/
          2014/                  # 2014 API version
            index.json           # API index file
            spells.json          # List endpoint
            spells/              # Directory for individual items
              acid-arrow.json    # Individual item
              ...
          2024/                  # 2024 API version
            index.json           # API index file
            ...
```

## Timestamps

The script adds an `updated_at` timestamp to all records it creates or updates. This timestamp is used to determine if a record needs to be updated in subsequent runs.
