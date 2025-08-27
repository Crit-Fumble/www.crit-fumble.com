import { GameSheet } from "../Compendium";

export interface PartySheet extends GameSheet {
    campaign_ids: string[]; // GM is determined at the campaign level
    sheet_ids: string[]; // SheetIds of Party Members
    pdf_url?: string; // if the user wants to use a PDF instead of the sheet
    data?: any; // sheet data as defined by schema
    sheets?: PartySheet[];
    // campaigns?: Campaign[];
}
    