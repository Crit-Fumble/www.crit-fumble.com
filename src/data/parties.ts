
// eslint-disable-next-line import/no-anonymous-default-export
export default [
  // Live Tuesdays
  {
    id: '3',
    campaign: '0',
    gm: '0',
    slug: 'bom',
    name: 'Barrel of Mayhem',
    active: true,
    playtime: {
      day: 'Every Tuesday',
      times: ['7:30pm - 10:00pm CDT', '8:30pm - 11:00pm EDT', ],
    },
    dndBeyond: { id: '5789654' },
    roll20: { 
      id: '17858042',
      join: '17858042/E_iyPw',
    },
    discord: {
      roleId: '1270594737211965551',
      voiceChannelId: '1175910585020448768',
      sideChatThreadId: '1305939321186025513',
      questLogThreadId: '1296206616525406409',
      gameplayThreadId: '1306016948651429999',
    },
  },

  // Live - TPKs
  {
    id: '4',
    campaign: '0',
    gm: '0',
    slug: 'tpks',
    name: 'The Total Party Knockouts',
    active: true,
    playtime: {
      day: 'Every Other Saturday',
      times: ['5:30pm - 10:00pm CDT', '6:30pm - 11:00pm EDT', ],
    },
    dndBeyond: { id: '4820997'},
    roll20: { 
      id: '17353381',
      join: '17353381/wX4-tw',
    },
    discord: {
      roleId: '1175901224785162391',
      voiceChannelId: '1175910585020448768',
      sideChatThreadId: '1305940098822570004',
      questLogThreadId: '1296206495784112128',
      gameplayThreadId: '1306016293811523686',
    },
  },
  {
    id: '14',
    campaign: '0',
    gm: '0',
    name: 'Blue Lily Alchemy',
    slug: 'blue-lily-alchemy',
    parentParty: '4',
    active: true,
    discord: {
      sideChatThreadId: '1208506710206193664',
    },
  },
  {
    id: '24',
    campaign: '0',
    gm: '0',
    name: 'The Arcane Regiment',
    slug: 'arcane-regiment',
    parentParty: '4',
    active: true,
    discord: {
      sideChatThreadId: '1208880481668440124',
    },
  },
  {
    id: '34',
    campaign: '0',
    gm: '0',
    name: 'The Dungeon Asset Procurement Squad',
    slug: 'daps',
    parentParty: '4',
    active: false,
    discord: {
      sideChatThreadId: '1208444082054111302',
    },
  },
  {
    id: '44',
    campaign: '0',
    gm: '0',
    parentParty: '4',
    active: true,
    name: 'Looking for Clues Detective Agency',
    slug: 'looking-for-clues',
    discord: {
      sideChatThreadId: '1208507508532969482',
    },
  },
  {
    id: '54',
    campaign: '0',
    gm: '0',
    parentParty: '4',
    active: true,
    name: 'Undertale Ventures, Inc',
    slug: 'undertale-ventures-inc',
    discord: {
      sideChatThreadId: '1220862831025590353',
    },
  },

  // Pbp
  {
    id: '6',
    campaign: '0',
    gm: '0',
    name: 'The Coastal Commission',
    slug: 'cc',
    active: false,
    playtime: 'Play-by-post Only',
    dndBeyond: { id: '3683948' },
    discord: {
      roleId: '1223108951005073418',
      sideChatThreadId: '1305940098822570004',
      questLogThreadId: '1296206495784112128',
      gameplayThreadId: '1306016293811523686',
    },
  },

  // In-person
  {
    id: '5',
    campaign: '0',
    gm: '0',
    // parentParty: 'P',
    name: 'Thoreau Holdings, LLC',
    slug: 'th-llc',
    dndBeyond: { id: '4570864' },
    discord: {
      sideChatThreadId: '1208143325735948351',
    },
  },
  {
    id: '42069',
    campaign: '0',
    gm: '0',
    name: 'The Multiversal Dungeon Society',
    slug: 'mds',
    roll20: { id: '16807234' },
  },
  {
    id: '69420',
    campaign: '0',
    gm: '0',
    name: 'The Party',
    slug: 'the-party',
    // roll20: { id: '16807234' },
    discord: {
      sideChatThreadId: '1089044977008521307',
    },
  },
  {
    id: '420',
    campaign: '0',
    gm: '0',
    name: 'Ministry of Mask',
    slug: 'ministry-of-mask',
    // roll20: { id: '16807234' },
    discord: {
      sideChatThreadId: '1208501417933930527',
    },
  },
  {
    id: '12300',
    campaign: '9',
    gm: '0',
    player: '300',
    name: 'Buttons',
  },
]