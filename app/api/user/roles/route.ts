import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';

// This route uses dynamic features
export const dynamic = 'force-dynamic';

/**
 * Get Discord role information for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.roles || session.roles.length === 0) {
      console.log('Debug: No roles in session:', { hasRoles: !!session.roles, roleCount: session.roles?.length });
      return NextResponse.json({ roles: [] });
    }

    console.log('Debug: User has roles in session:', session.roles.length, session.roles);

    // Fetch role details from Discord
    const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
    const guildId = process.env.DISCORD_SERVER_ID;

    if (!botToken || !guildId) {
      console.log('Debug: Discord not configured:', { hasBotToken: !!botToken, hasGuildId: !!guildId });
      return NextResponse.json({ error: 'Discord not configured' }, { status: 500 });
    }

    console.log('Debug: Fetching guild roles for guild:', guildId);

    // Get all guild roles
    const rolesResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
      },
    });

    // Also fetch guild information to get the server name
    const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
      },
    });

    if (!rolesResponse.ok) {
      console.error('Failed to fetch guild roles:', rolesResponse.status, rolesResponse.statusText);
      return NextResponse.json({ error: 'Failed to fetch role information' }, { status: 500 });
    }

    const allRoles = await rolesResponse.json();
    console.log('Debug: Fetched all guild roles:', allRoles.length);

    // Get guild info (server name)
    let guildName = 'Discord Server'; // fallback
    if (guildResponse.ok) {
      const guildInfo = await guildResponse.json();
      guildName = guildInfo.name;
      console.log('Debug: Fetched guild info:', guildName);
    } else {
      console.warn('Failed to fetch guild info:', guildResponse.status);
    }
    
    // Filter to only the roles the user has
    const userRoles = allRoles.filter((role: any) => session.roles!.includes(role.id));
    console.log('Debug: User roles found:', userRoles.length, userRoles.map((r: any) => r.name));
    
    // Sort by position (higher positions first)
    userRoles.sort((a: any, b: any) => b.position - a.position);
    
    // Format for client
    const roleInfo = userRoles.map((role: any) => ({
      id: role.id,
      name: role.name,
      color: role.color,
      position: role.position,
      permissions: role.permissions,
      managed: role.managed,
      mentionable: role.mentionable,
    }));

    return NextResponse.json({ 
      roles: roleInfo, 
      guildName: guildName,
      guildId: guildId 
    });
    
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}