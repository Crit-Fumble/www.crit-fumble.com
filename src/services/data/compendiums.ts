import dnd5eCfg from './compendiums/dnd5eCfg';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    system: '5',
    id: '5',
    name: 'CFG D&D 5e 5.1 Compendium',
    slug: 'dnd5e-cfg-51',
    description: 'Our custom D&D 5e content supplemented with data from the free [D&D 5e API](https://www.dnd5eapi.co/).',
    srdApi: 'https://www.dnd5eapi.co/',
    data: dnd5eCfg,
  },
  {
    system: '2',
    id: '2',
    name: 'Old Gus\' Cypher 2e SRD',
    slug: 'cypher-cfg-2',
    description: 'Our custom Cypher System content supplemented with data from [Old Gus\' Cypher SRD](https://callmepartario.github.io/og-csrd).',
    // data: cypher,
  },
  // {
  //   system: '5',
  //   id: '',
  //   name: '',
  //   slug: '',
  //   description: '',
  //   data: {
      
  //   }
  // }
]
