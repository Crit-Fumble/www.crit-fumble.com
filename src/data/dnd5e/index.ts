import { attacks, bonusActions, freeActions, movements, objectInteractions, reactions, socialInteractions, standardActions } from "./compendium/actions";

const Dnd5e = {
  actions: {
    attack: attacks, 
    bonus: bonusActions, 
    free: freeActions, 
    movement: movements, 
    object: objectInteractions, 
    social: socialInteractions, 
    standard: standardActions
  },
};

export const baseCharacter = {
  actions: {
    standard: standardActions.filter(act => act.default),
    bonus: bonusActions.filter(act => act.default),
    object: objectInteractions.filter(act => act.default),
    social: socialInteractions.filter(act => act.default),
    free: freeActions.filter(act => act.default),
    movement: movements.filter(act => act.default),
    reaction: reactions.filter(act => act.default),
    attack: attacks.filter(act => act.default),
  },
}
export default Dnd5e;