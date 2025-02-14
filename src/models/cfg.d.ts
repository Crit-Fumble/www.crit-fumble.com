import { DiscordProfile } from "next-auth/providers/discord"
import { User as _User } from "next-auth";

export type User = {
  id: string,
  name: string,
  email?: string,
  image?: string,
  token?: string,
  discord?: DiscordProfile,
};

export type System = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  // image?: string;
}

export type Campaign = {
  id: string;
  system: string;
  name: string;
  slug: string;
  gms: string[];
  worldAnvil: {
    id: string;
    name: string,
    slug: string;
    worldMapId?: string;
    chronicleId?: string;
    chronicleSlug?: string;
  };
  discord?: {
    id?: string;
    fumbleBotId?: string;
    playerRoles?: string[];
    botRoles?: string[];
    voiceChannelId?: string;
    chatChannelId?: string;
    chatThreadId?: string;
    forumChannelId?: string;
    playByPostChannelId?: string;
    playByPostThreadId?: string;
  };
  // image?: string;
  // description?: string;
  // sheet?: any;
  // data?: any;
}

export type Party = {
  id: string;
  campaign: string;
  gm: string;
  slug: string;
  name: string;
  active: boolean;
  playtime: {
    day: string;
    times?: string[];
  };
  dndBeyond?: {
    id: string;
    join?: string;
  };
  roll20?: {
    id: string;
    join?: string;
  }
  discord: {
    roleId: string;
    voiceChannelId: string;
    sideChatThreadId: string;
    questLogThreadId: string;
    gameplayThreadId: string;
  },
  // image?: string;
  // system: string;
  // description?: string;
  // sheet?: any;
}

export type Character = {
  id: string;
  player: string;
  campaign: string;
  party: string;
  name: string;
  slug: string;
  foundryVtt?: {
    user?: string;
    password?: string;
  };
  dndBeyond: {
    id: string;
  };
  image?: string;
  system: string;
  description: string;
  sheet: any;
  data: any;
}

export type Profile = {
  id: string;
  name: string;
  image?: string;
  slug: string;
  pronouns?: string;
  discord?: {
    id: string;
    name: string;
    displayName: string;
  };
  steam?: {
    slug: string;
    name: string;
  };
  worldAnvil?: {
    id: string;
    slug: string;
    name: string;
  };
  dndBeyond?: {
    name: string;
  };
  roll20?: {
    id: string;
    slug: string;
    name: string;
  };
  admin?: boolean;
}


