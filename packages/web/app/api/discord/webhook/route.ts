export async function GET(request: Request) {
  return new Response('API is Live!');
}

// TODO: Put Discord Webhooks here, then configure it in the Discord Developer Portal
// https://discord.com/developers/docs/events/webhook-events#preparing-for-events