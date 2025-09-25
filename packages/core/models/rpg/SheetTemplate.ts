/**
 * RPG Sheet Template System
 * 
 * Defines the structure and validation for different game system character sheets
 */

export interface SheetField {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object';
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[]; // For select fields
  computed?: boolean; // If this field is calculated from others
  formula?: string;   // Formula for computed fields
}

export interface SheetSection {
  id: string;
  name: string;
  fields: SheetField[];
  repeatable?: boolean; // For things like spells, equipment lists
}

export interface SheetTemplate {
  id: string;
  name: string;
  rpgSystem: string;
  version: string;
  sections: SheetSection[];
  computedFields: Record<string, string>; // field_id -> formula
}

/**
 * Base sheet templates for common game systems
 */
export const SHEET_TEMPLATES: Record<string, SheetTemplate> = {
  'dnd5e': {
    id: 'dnd5e',
    name: 'D&D 5th Edition',
    rpgSystem: 'dnd5e',
    version: '1.0',
    sections: [
      {
        id: 'basic_info',
        name: 'Basic Information',
        fields: [
          { id: 'character_name', name: 'Character Name', type: 'string', required: true },
          { id: 'class', name: 'Class', type: 'string', required: true },
          { id: 'level', name: 'Level', type: 'number', required: true, min: 1, max: 20 },
          { id: 'race', name: 'Race', type: 'string', required: true },
          { id: 'background', name: 'Background', type: 'string' },
          { id: 'alignment', name: 'Alignment', type: 'string', options: [
            'Lawful Good', 'Neutral Good', 'Chaotic Good',
            'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
            'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
          ]}
        ]
      },
      {
        id: 'ability_scores',
        name: 'Ability Scores',
        fields: [
          { id: 'strength', name: 'Strength', type: 'number', required: true, min: 1, max: 30 },
          { id: 'dexterity', name: 'Dexterity', type: 'number', required: true, min: 1, max: 30 },
          { id: 'constitution', name: 'Constitution', type: 'number', required: true, min: 1, max: 30 },
          { id: 'intelligence', name: 'Intelligence', type: 'number', required: true, min: 1, max: 30 },
          { id: 'wisdom', name: 'Wisdom', type: 'number', required: true, min: 1, max: 30 },
          { id: 'charisma', name: 'Charisma', type: 'number', required: true, min: 1, max: 30 },
          // Computed modifiers
          { id: 'strength_mod', name: 'Strength Modifier', type: 'number', computed: true, formula: 'floor((strength - 10) / 2)' },
          { id: 'dexterity_mod', name: 'Dexterity Modifier', type: 'number', computed: true, formula: 'floor((dexterity - 10) / 2)' },
          { id: 'constitution_mod', name: 'Constitution Modifier', type: 'number', computed: true, formula: 'floor((constitution - 10) / 2)' },
          { id: 'intelligence_mod', name: 'Intelligence Modifier', type: 'number', computed: true, formula: 'floor((intelligence - 10) / 2)' },
          { id: 'wisdom_mod', name: 'Wisdom Modifier', type: 'number', computed: true, formula: 'floor((wisdom - 10) / 2)' },
          { id: 'charisma_mod', name: 'Charisma Modifier', type: 'number', computed: true, formula: 'floor((charisma - 10) / 2)' }
        ]
      },
      {
        id: 'combat_stats',
        name: 'Combat Stats',
        fields: [
          { id: 'armor_class', name: 'Armor Class', type: 'number', computed: true, formula: '10 + dexterity_mod' },
          { id: 'hit_points', name: 'Hit Points', type: 'number', required: true },
          { id: 'hit_point_max', name: 'Hit Point Maximum', type: 'number', computed: true },
          { id: 'speed', name: 'Speed', type: 'number', required: true },
          { id: 'proficiency_bonus', name: 'Proficiency Bonus', type: 'number', computed: true, formula: 'ceil(level / 4) + 1' }
        ]
      }
    ],
    computedFields: {
      'strength_mod': 'Math.floor((data.strength - 10) / 2)',
      'dexterity_mod': 'Math.floor((data.dexterity - 10) / 2)',
      'constitution_mod': 'Math.floor((data.constitution - 10) / 2)',
      'intelligence_mod': 'Math.floor((data.intelligence - 10) / 2)',
      'wisdom_mod': 'Math.floor((data.wisdom - 10) / 2)',
      'charisma_mod': 'Math.floor((data.charisma - 10) / 2)',
      'armor_class': '10 + data.dexterity_mod',
      'proficiency_bonus': 'Math.ceil(data.level / 4) + 1',
      'hit_point_max': 'data.hit_points' // Can be overridden with more complex formulas
    }
  }
};

/**
 * Get template for a game system
 */
export function getSheetTemplate(rpgSystem: string): SheetTemplate | null {
  return SHEET_TEMPLATES[rpgSystem] || null;
}

/**
 * Validate sheet data against template
 */
export function validateSheetData(data: Record<string, any>, template: SheetTemplate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const section of template.sections) {
    for (const field of section.fields) {
      const value = data[field.id];
      
      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field.name} is required`);
        continue;
      }
      
      // Skip validation for missing optional fields
      if (value === undefined || value === null) continue;
      
      // Type validation
      if (field.type === 'number' && typeof value !== 'number') {
        errors.push(`${field.name} must be a number`);
        continue;
      }
      
      // Range validation for numbers
      if (field.type === 'number' && typeof value === 'number') {
        if (field.min !== undefined && value < field.min) {
          errors.push(`${field.name} must be at least ${field.min}`);
        }
        if (field.max !== undefined && value > field.max) {
          errors.push(`${field.name} must be at most ${field.max}`);
        }
      }
      
      // Options validation
      if (field.options && !field.options.includes(value)) {
        errors.push(`${field.name} must be one of: ${field.options.join(', ')}`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Calculate computed fields for sheet data
 */
export function calculateComputedFields(data: Record<string, any>, template: SheetTemplate): Record<string, any> {
  const result = { ...data };
  
  for (const [fieldId, formula] of Object.entries(template.computedFields)) {
    try {
      // Simple formula evaluation - in production, use a safer evaluator
      const value = eval(formula.replace(/data\./g, 'result.'));
      result[fieldId] = value;
    } catch (error) {
      console.warn(`Failed to calculate ${fieldId}: ${error}`);
    }
  }
  
  return result;
}