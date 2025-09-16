#!/bin/bash

echo "🚀 Fast Test Mock Fixer - Mass replacing common patterns"

# Change to core directory
cd "$(dirname "$0")/.."

# Count total test files
TOTAL_FILES=$(find __tests__ -name "*.test.ts" | wc -l)
echo "📊 Processing $TOTAL_FILES test files..."

# Common field replacements
echo "🔧 Fixing field name mappings..."
find __tests__ -name "*.test.ts" -exec sed -i 's/createdAt:/created_at:/g' {} \;
find __tests__ -name "*.test.ts" -exec sed -i 's/updatedAt:/updated_at:/g' {} \;

# Fix RpgCampaign name -> title
echo "🔧 Fixing RpgCampaign field names..."
find __tests__ -path "*RpgCampaign*" -name "*.test.ts" -exec sed -i 's/name:/title:/g' {} \;

# Add missing required fields to mock objects using a more targeted approach
echo "🔧 Adding missing required fields..."

# For RpgSession mocks - add all required fields
find __tests__ -name "*RpgSession*.test.ts" -exec sed -i '/mockResolvedValue({$/,/})/{
  /id:/!{/worldanvil_id:/!{s/$/\n    worldanvil_id: null,/}}
  /data:/!{s/$/\n    data: {},/}
  /created_at:/!{s/$/\n    created_at: new Date(),/}
  /updated_at:/!{s/$/\n    updated_at: new Date(),/}
  /discord_event_id:/!{s/$/\n    discord_event_id: null,/}
  /description:/!{s/$/\n    description: null,/}
  /rpg_party_id:/!{s/$/\n    rpg_party_id: null,/}
}' {} \;

# For RpgParty mocks - add all required fields  
find __tests__ -name "*RpgParty*.test.ts" -exec sed -i '/mockResolvedValue({$/,/})/{
  /slug:/!{s/$/\n    slug: null,/}
  /data:/!{s/$/\n    data: {},/}
  /discord_post_id:/!{s/$/\n    discord_post_id: null,/}
  /discord_thread_id:/!{s/$/\n    discord_thread_id: null,/}
  /is_active:/!{s/$/\n    is_active: true,/}
  /created_at:/!{s/$/\n    created_at: new Date(),/}
  /updated_at:/!{s/$/\n    updated_at: new Date(),/}
  /worldanvil_party_id:/!{s/$/\n    worldanvil_party_id: null,/}
  /discord_role_id:/!{s/$/\n    discord_role_id: null,/}
  /rpg_campaign_id:/!{s/$/\n    rpg_campaign_id: "campaign-123",/}
}' {} \;

# For RpgCharacter mocks - add all required fields
find __tests__ -name "*RpgCharacter*.test.ts" -exec sed -i '/mockResolvedValue({$/,/})/{
  /slug:/!{s/$/\n    slug: null,/}
  /created_at:/!{s/$/\n    created_at: new Date(),/}
  /updated_at:/!{s/$/\n    updated_at: new Date(),/}
  /worldanvil_character_id:/!{s/$/\n    worldanvil_character_id: null,/}
  /discord_post_id:/!{s/$/\n    discord_post_id: null,/}
  /discord_thread_id:/!{s/$/\n    discord_thread_id: null,/}
  /data:/!{s/$/\n    data: {},/}
  /user_id:/!{s/$/\n    user_id: "user-123",/}
  /title:/!{s/$/\n    title: null,/}
  /description:/!{s/$/\n    description: null,/}
  /rpg_world_id:/!{s/$/\n    rpg_world_id: null,/}
  /rpg_system_id:/!{s/$/\n    rpg_system_id: null,/}
}' {} \;

# Add id field to CreateInput types
echo "🔧 Adding missing id fields to CreateInput..."
find __tests__ -name "*.test.ts" -exec sed -i '/const.*Data: Prisma\..*CreateInput = {$/,/^[[:space:]]*}/{
  /id:/!{
    /^[[:space:]]*}$/i\
    id: "test-id-123",
  }
}' {} \;

# Fix User mock objects
find __tests__ -name "*User*.test.ts" -exec sed -i '/mockResolvedValue({$/,/})/{
  /discord_id:/!{s/$/\n    discord_id: null,/}
  /worldanvil_id:/!{s/$/\n    worldanvil_id: null,/}
  /slug:/!{s/$/\n    slug: null,/}
  /email:/!{s/$/\n    email: null,/}
  /emailVerified:/!{s/$/\n    emailVerified: null,/}
  /image:/!{s/$/\n    image: null,/}
  /createdAt:/!{s/$/\n    createdAt: new Date(),/}
  /updatedAt:/!{s/$/\n    updatedAt: new Date(),/}
  /admin:/!{s/$/\n    admin: false,/}
  /data:/!{s/$/\n    data: null,/}
}' {} \;

echo "✅ Mass replacements complete!"
echo "⚡ Tests should now compile much faster with proper mock data!"
echo "🧪 Run 'npm test' to verify the fixes"