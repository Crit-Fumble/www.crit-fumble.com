import { GameSheet } from "../Compendium";

export interface GameSystem extends GameSheet {
    id: string;
    version: string;
    name: string;
    summary?: string;
    description?: string;
    "url"?: string;
    data?: any;
}
