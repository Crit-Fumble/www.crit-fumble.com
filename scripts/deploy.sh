#!/bin/bash

# Deployment script

# Build the project
npm run build

# Register Discord commands
node scripts/deploy-register-discord-commands.js

# Additional deployment steps can be added here
