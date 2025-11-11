/**
 * API Route: Sync Events from Curling.io
 * POST /api/admin/sync/curlingio
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { curlingIOSync } from '@/lib/services/event-sync/curlingio-sync';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Check if user is admin
    // For now, allow any authenticated user

    console.log('[API] Starting Curling.io sync...');
    const result = await curlingIOSync.syncEvents();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Curling.io sync failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        events_fetched: 0,
        events_created: 0,
        events_updated: 0,
        events_skipped: 0,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Test connection
    const isConnected = await curlingIOSync.testConnection();

    return NextResponse.json({
      connected: isConnected,
      message: isConnected 
        ? 'Curling.io API is accessible' 
        : 'Failed to connect to Curling.io API',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, connected: false },
      { status: 500 }
    );
  }
}
