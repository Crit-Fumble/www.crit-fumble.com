import { RpgSystem as PrismaRpgSystem, RpgSession as PrismaRpgSession } from "@prisma/client";

export type RpgSystem = PrismaRpgSystem;
export type GameSession = PrismaRpgSession;

export interface BaseSheet {
    id: string;
    version?: string;
    name: string;
    summary?: string;
    description?: string;
    url?: string;
    data?: any;
}

export interface RpgSystemSheet extends BaseSheet {
    version: string;
}

export interface GameSessionSheet extends BaseSheet {
    // Additional fields specific to game sessions
}