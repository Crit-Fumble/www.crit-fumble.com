# Prisma Schema Update: World-System Many-to-Many Relationship

## Overview

Updated the Prisma schema to support a **many-to-many relationship** between Worlds and Systems, while keeping Campaigns tied to a single System.

## Changes Made

### 1. Updated `RpgWorld` Model
- **Removed**: Direct `rpg_system_id` foreign key
- **Added**: `rpg_world_systems RpgWorldSystem[]` relation

### 2. Updated `RpgSystem` Model  
- **Removed**: Direct `rpg_worlds RpgWorld[]` relation
- **Added**: `rpg_world_systems RpgWorldSystem[]` relation

### 3. Added `RpgWorldSystem` Junction Table
- **Purpose**: Manages many-to-many relationship between worlds and systems
- **Key Features**:
  - `world_id` and `system_id` foreign keys
  - `is_primary` boolean flag to mark the primary system for a world
  - Unique constraint on `(world_id, system_id)` pair
  - Proper indexes for performance

### 4. `RpgCampaign` Model Unchanged
- **Maintains**: Single `rpg_system_id` relationship
- **Rationale**: Campaigns should use only one game system per campaign

## Benefits

1. **Flexibility**: Worlds can now support multiple game systems
2. **WorldAnvil Compatibility**: Matches WorldAnvil's ability to change/link systems
3. **Primary System**: Supports designating one system as primary for a world
4. **Campaign Clarity**: Campaigns remain tied to a single system for simplicity

## Next Steps Required

### 1. Run Database Migration
```bash
cd packages/core
npm run migrate -- --name add-world-system-many-to-many
```

### 2. Regenerate Prisma Client
```bash
cd packages/core  
npm run generate
```

### 3. Update RpgWorldService Methods
- Uncomment the new many-to-many relationship methods in `RpgWorldService.ts`
- Update `getBySystemId()` to use the new junction table
- Test the new relationship management methods

### 4. Update Tests
- Create comprehensive tests for the new junction table operations
- Test world-system relationship management
- Verify campaign-system relationships remain unchanged

## New Service Methods (Commented Out Until Migration)

The following methods have been prepared in `RpgWorldService.ts`:
- `addSystemToWorld(worldId, systemId, isPrimary)`
- `removeSystemFromWorld(worldId, systemId)`
- `getWorldSystems(worldId)` 
- `getPrimaryWorldSystem(worldId)`
- `setPrimarySystem(worldId, systemId)`

## Usage Examples

After migration, these operations will be possible:

```typescript
// Add D&D 5e as primary system to a world
await worldService.addSystemToWorld('world-1', 'dnd5e-system', true);

// Add Pathfinder as secondary system  
await worldService.addSystemToWorld('world-1', 'pathfinder-system', false);

// Get all systems for a world
const systems = await worldService.getWorldSystems('world-1');

// Get just the primary system
const primarySystem = await worldService.getPrimaryWorldSystem('world-1');

// Change primary system
await worldService.setPrimarySystem('world-1', 'pathfinder-system');
```

## Database Schema

The new junction table structure:

```sql
CREATE TABLE "RpgWorldSystem" (
  "id" TEXT NOT NULL,
  "world_id" TEXT NOT NULL,
  "system_id" TEXT NOT NULL, 
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "RpgWorldSystem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RpgWorldSystem_world_id_system_id_key" UNIQUE ("world_id", "system_id")
);
```

This update provides the flexibility needed for multi-system worlds while maintaining the simplicity of single-system campaigns.