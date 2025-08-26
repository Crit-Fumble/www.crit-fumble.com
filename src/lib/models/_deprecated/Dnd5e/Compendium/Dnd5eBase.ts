import { GameDie } from "../../../Compendium/GameBase";

export enum Dnd5eHitDie {
    D6 = GameDie.D6,
    D8 = GameDie.D8,
    D10 = GameDie.D10,
    D12 = GameDie.D12,
}

export interface Dnd5eAbility {
    id: string;
    title: string;
    description: string;
}