#!/bin/bash
sed -i 's/flags: 64 \/\/ EPHEMERAL/flags: MessageFlags.Ephemeral/g' /workspaces/www.crit-fumble.com/app/api/discord/webhooks/route.ts
echo "Replaced all instances of flags: 64 // EPHEMERAL with MessageFlags.Ephemeral"