export const postgres = {
  url: process.env.POSTGRES_URL ?? '',
  url_no_ssl: process.env.POSTGRES_URL_NO_SSL ?? '',
  url_non_pooling: process.env.POSTGRES_URL_NON_POOLING ?? '',
  url_prisma: process.env.POSTGRES_URL ?? '',
  port: process.env.POSTGRES_PORT ?? 5432,
  host: process.env.POSTGRES_HOST ?? '',
  user: process.env.POSTGRES_USER ?? 'default',
  password: process.env.POSTGRES_PASSWORD ?? '',
  database: process.env.POSTGRES_DATABASE ?? '',
}

export const openAi = {
  key: process.env.OPENAI_API_KEY ?? '',
  prompt: process.env.GPT_BASE_PROMPT ?? '',
};

export const worldAnvil = {
  key: process.env.WORLD_ANVIL_KEY ?? '',
  token: process.env.WORLD_ANVIL_TOKEN ?? '',
  endpoint: 'https://www.worldanvil.com/api/external/boromir',
};

export const discord = {
  id: '1002008886137589771',
  cfgAdminRole: '1056055558278479893',
  key: process.env.DISCORD_PUBLIC_KEY ?? '',
  appId: process.env.DISCORD_APP_ID ?? '',
  authId: process.env.AUTH_DISCORD_ID ?? '',
  authSecret: process.env.AUTH_DISCORD_SECRET ?? '',
};

export const roll20 = {
  id: '6244861',
  name: 'Crit Fumble Gaming',
  slug: 'crit-fumble-gaming',
}

export const dndBeyond = {

}

const config = { 
  worldAnvil,
  discord,
};

export default config;

