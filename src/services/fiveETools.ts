"use server";

const FIVE_E_TOOLS_URL = 'https://5etools.crit-fumble.com/';

export const fiveEToolsDataHandler = async (path: string) => (await fetch(`${FIVE_E_TOOLS_URL}${path.slice('/play/dnd5e/'.length)}`))?.json();
// export const fiveEToolsHandler = async (path: string) => (await fetch(`${FIVE_E_TOOLS_URL}${path.slice('/play/dnd5e/tools/'.length)}`));