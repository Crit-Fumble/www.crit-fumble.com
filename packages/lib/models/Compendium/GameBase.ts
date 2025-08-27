export enum GameDie {
    D2 = 'd2',
    D4 = 'd4',
    D6 = 'd6',
    D8 = 'd8',
    D10 = 'd10',
    D12 = 'd12',
    D20 = 'd20',
    D100 = 'd100',
}

export interface GameSheet {
    id: string;
    game_system_ids?: string[]; //sheets may be shared between game systems; if blank, sheet is universal
    name: string;
    slug: string;
    created_at: Date;
    updated_at: Date;
    description?: string;
    summary?: string;
    portrait_url?: string;
    token_url?: string;
    pdf_url?: string;
    data?: any;
}

export enum GameSourceType {
    CFG = 'cfg', // CFG original content which has not been published
    BOOK = 'book', // a published source, must verify ownership of source on at least one platform or via physical barcode
    SRD = 'srd', // a freely available source
    HB = 'homebrew', // a homebrew source, such as a Player's private compendium
    
}
export interface GameSource {
    id: string;
    type: GameSourceType;
    game_system_ids?: string[]; //source may be shared between game systems; if blank, source is universal
    name: string;
    slug: string;
    created_at: Date;
    updated_at: Date;
    description?: string;
    summary?: string;

    url?: string;
    pdf_url?: string;
    api?: any; // an object containing an api configuration, so we can use it to fetch from the source
    data?: any; // json data store
}

export interface GameChapter {
    
}
export interface GameBook extends GameSource {
    type: GameSourceType.BOOK;
    chapters?: GameChapter[];
}