
// a world is any setting where a TTRPG story may take place

// each system will derive it's own world service from this base service, but this base service should be fully functional for worlds without an assigned system, or with an unrecognized system, in World Anvil.

// most of the "world" functionality will be facilitated by integrating with World Anvil directly, using .env variables WORLD_ANVIL_KEY and WORLD_ANVIL_TOKEN; this service is ONLY the service logic for that functionality

// use WorldAnvilService.ts to communicate /w WorldAnvil

export {}