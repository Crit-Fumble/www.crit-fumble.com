
export type Character = {
  name: string,
  image?: string,
  system: string,
  description: string,
  sheet: any;
  data: any;
}

export type CfgProfile = {
  name: string,
  pronouns: string,
  image?: string,
  characters: Character[],
  gameSystems: string[],
  gameSettings: string[],
}

