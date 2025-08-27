
export enum Dnd5eItemType {
    WEAPON = 'weapon',
    ARMOR = 'armor',
    SHIELD = 'shield',
    POTION = 'potion',
    RING = 'ring',
    ROD = 'rod',
    SCROLL = 'scroll',
    WAND = 'wand',
    SPELL = 'spell',
    ITEM = 'item',
}

export enum Dnd5eItemRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    VERY_RARE = 'very_rare',
    LEGENDARY = 'legendary',
}

export interface Dnd5eItem {
    id: string;
    title: string;
    description?: string;
    type: Dnd5eItemType;
    rarity: Dnd5eItemRarity;
    magical: boolean;
    
}

// TODO: child classes for each item type