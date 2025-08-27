// TODO: build out a model for D&D5e proficiency

export enum ProficiencyRank {
    NOT_PROFICIENT = 0,
    PROFICIENT = 1,
    EXPERTISE = 2,
}

export enum ProficiencyType {
    SKILL = "skill",
    SAVING_THROW = "saving_throw",
    TOOL = "tool",
    WEAPON = "weapon",
    ARMOR = "armor",
    LANGUAGE = "language",
    VEHICLE = "vehicle",
}

export interface Dnd5eProficiency {
    id: string;
    type: ProficiencyType;
    title: string; // name of the proficiency
    description?: string; // human readable description
    maxRank?: ProficiencyRank; // 2 for skills, 1 for all others, 1 by default
}
