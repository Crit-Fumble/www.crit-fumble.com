"use server";

const FIVE_E_TOOLS_URL = 'https://2014.5e.tools/';

export const fiveEToolsDataHandler = async (path: string) => (await fetch(`${FIVE_E_TOOLS_URL}${path.slice('/system/dnd5e/tool-api'.length)}`))?.json();
export const fiveEToolsHandler = async (path: string) => (await fetch(`${FIVE_E_TOOLS_URL}${path.slice('/system/dnd5e/tools/'.length)}`));