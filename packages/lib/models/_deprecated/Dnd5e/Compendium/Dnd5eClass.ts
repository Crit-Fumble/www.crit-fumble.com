import { Dnd5eAbility, Dnd5eHitDie } from "./Dnd5eBase";
import { Dnd5eProficiency } from "./Dnd5eProficiency";

export enum Dnd5eClassType {
    PLAYER = 'player', // traditional player classes
    // SIDEKICK = 'sidekick', // sidekick classes with lower/simpler progression, choose base stat block cr 1/2 or lower
    // COMPANION = 'companion', // FUTURE: companion classes, custom npc stat block
    // NPC = 'npc', // custom NPC classes, based on SRD stat blocks
}

export enum Dnd5eClassComplexity {
    LOW = 'Low',
    AVERAGE = 'Average',
    HIGH = 'High',
}

export interface Dnd5eClassFeature{
    id: string;
    title: string; // name of the feature
    description?: string; // human readable description   
}

export interface Dnd5eWeaponMastery{
    id: string;
    title: string; // name of the weapon
    description?: string; // human readable description
}

export interface Dnd5eClassLevel{
    id: string;
    features: Dnd5eClassFeature[];
    weapon_mastery: Dnd5eWeaponMastery[];
}

export interface Dnd5eClass{
    id: string;
    type: Dnd5eClassType;
    title: string; // name of the class
    hitDie: Dnd5eHitDie; // d6 - d12 for all player classes; d8 by default
    levels?: Dnd5eClassLevel[]; // 20 levels of progression for all traditional player and sidekick classes
    proficiencies?: Dnd5eProficiency[]; // all saving throws, skills, etc
    summary?: string; // short description of the class
    description?: string; // human readable description
    primaryAbility?: Dnd5eAbility[];
    complexity?: Dnd5eClassComplexity;
    maxLevel?: 20; // 20 for all player classes
    // startingEquipment: Dnd5eItem[];
}
