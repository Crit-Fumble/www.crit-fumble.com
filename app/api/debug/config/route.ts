import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { getDiscordConfig, getDatabaseConfig } from '@crit-fumble/core/models/config';

/**
 * Debug endpoint to check configuration and database connectivity
 * Admin only - requires admin authentication
 */
export async function GET() {
  try {
    // Check authentication and admin status
    const session = await getSession();
    if (!session || !session.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Test configurations
    const discordConfig = getDiscordConfig();
    const databaseConfig = getDatabaseConfig();

    // Test database connection
    const { PrismaClient } = await import('@crit-fumble/core');
    const prisma = new PrismaClient();
    
    let dbTest = false;
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
      dbTest = true;
      console.log('✅ Database connection successful, user count:', userCount);
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
    } finally {
      await prisma.$disconnect();
    }

    const config = {
      discord: {
        hasClientId: !!discordConfig.clientId,
        hasClientSecret: !!discordConfig.clientSecret,
        hasBotToken: !!discordConfig.botToken,
        hasServerId: !!discordConfig.serverId,
        hasApplicationId: !!discordConfig.applicationId,
        hasPublicKey: !!discordConfig.publicKey,
        adminIdsCount: discordConfig.adminIds?.length || 0,
        redirectUri: discordConfig.redirectUri || 'Not configured'
      },
      database: {
        hasUrl: !!databaseConfig.url,
        urlType: databaseConfig.url ? (
          databaseConfig.url.includes('POSTGRES_PRISMA_URL') ? 'POSTGRES_PRISMA_URL' :
          databaseConfig.url.includes('DATABASE_URL') ? 'DATABASE_URL' :
          'Other'
        ) : 'None',
        connectionTest: dbTest,
        userCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasNextPublicBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL
      }
    };

    return NextResponse.json({ config });

  } catch (error) {
    console.error('Error in config debug:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}