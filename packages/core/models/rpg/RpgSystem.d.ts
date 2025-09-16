import { GameSheet } from "../Compendium";
import { RpgSystem as PrismaRpgSystem, GameSession as PrismaGameSession } from "@prisma/client";

export type RpgSystem = PrismaRpgSystem;
export type GameSession = PrismaGameSession;

export interface RpgSystemSheet extends GameSheet {
    id: string;
    version: string;
    name: string;
    summary?: string;
    description?: string;
    url?: string;
    data?: any;
}

export interface GameSessionSheet extends GameSheet {
    id: string;
    name: string;
    summary?: string;
    description?: string;
    url?: string;
    data?: any;
}

