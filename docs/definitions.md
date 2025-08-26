# Game System Definitions

These json files will be used to define a game system for crit-fumble.com.

## Game System Definition

A game system definition is a json file that defines a game system for crit-fumble.com.

### Game System Definition Fields

- name: The name of the game system.
- description: A description of the game system.
- version: The version of the game system.
- author: The author of the game system.
- license: The license of the game system.
- url: The url of the game system SRD or rules.
- schema: The schema of the game system.

### Game System Definition Schema

The schema of the game system defines the structure of the game system.

#### Game System Definition Schema Fields
- dice: a list of dice types used in the game system. [TODO]
- sheets: a list of sheet schemas used in the game system. [TODO]
- compendium

### Sheet Schema

A sheet schema defines the structure of a sheet for a game system.

#### Sheet Schema Fields
- type: The type of sheet. [character, npc, vehicle, settlement, realm, world, universe, etc]
- pages: a list of pages used in the sheet. each includes a layout and a list of fields; minimum one page. [TODO]
  - layout: a list of fields to display on the page. [one column, two column, three column, four column, 2x2 grid, 3x2 grid, 3x3 grid, etc] [TODO]
    - header: a list of header fields used in the sheet. [FUTURE]
      - fields: a list of fields used in the header. [Character Name, Character Level, etc] [FUTURE]
    - sections: a list of sections used in the sheet. [Abilities, Skills, Tool Proficiencies, Language Proficiencies, Wealth, Inventory,etc] [TODO] 
      - fields: a list of fields used in the section. [Strength, Wisdom, Slight of Hand, Common, GP, HP, InventoryList, etc] [TODO]
    - footer: a list of footer fields used in the sheet. [FUTURE]
      - fields: a list of fields used in the footer. [FUTURE]

#### Turn Schema
A "turn" schema describes a player's turn. A single system may have multiple turn schemes, such as "Combat", "Travel", "Exploration", "Roleplaying", "Downtime", etc.

#### Compendium Schema 
A "compendium" schema describes a compendium of game content for a game system. It will contain lists of things like spells, items, class features, etc.