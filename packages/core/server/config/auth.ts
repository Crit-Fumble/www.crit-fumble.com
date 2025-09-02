import { ConfigRegistry } from './registry';

/**
 * Auth configuration for next-auth/Auth.js
 * https://next-auth.js.org/getting-started/example
 */
const config = {
  providers: [
    {
      id: 'discord',
      name: 'Discord',
      type: 'oauth',
      authorization: {
        url: 'https://discord.com/api/oauth2/authorize',
        params: { scope: 'identify email guilds' }
      },
      token: 'https://discord.com/api/oauth2/token',
      userinfo: 'https://discord.com/api/users/@me',
      get clientId() { return ConfigRegistry.getInstance().requireConfig<string>('DISCORD_WEB_APP_ID'); },
      get clientSecret() { return ConfigRegistry.getInstance().requireConfig<string>('DISCORD_WEB_SECRET'); },
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
        };
      },
    }
  ],
  callbacks: {
    session({ session, token, user }: any) {
      return Promise.resolve(session); // The return type will match the one returned in `useSession()`
    },
    jwt({ token, trigger, session }: any) {
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name;
      }
      return Promise.resolve(token);
    },
  },
};

export default config;
