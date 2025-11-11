/**
 * Curling.io API Sync Service
 * Fetches events from Curling.io and syncs to local database
 */

import { interopService } from '../interoperability-service';
import { db } from '@/db/db';
import { events } from '@/db/schema/events';
import { eq } from 'drizzle-orm';

interface CurlingIOEvent {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  venue?: {
    name: string;
    city: string;
    province: string;
  };
  event_type: string;
  registration_fee?: number;
  max_teams?: number;
  description?: string;
}

interface SyncResult {
  success: boolean;
  events_fetched: number;
  events_created: number;
  events_updated: number;
  events_skipped: number;
  error?: string;
}

export class CurlingIOSyncService {
  /**
   * Sync events from Curling.io API
   */
  async syncEvents(): Promise<SyncResult> {
    const supabase = await createClient();
    const syncStarted = new Date();

    // Create sync log entry
    const { data: syncLog, error: logError } = await supabase
      .from('event_sync_logs')
      .insert({
        source: 'curlingio',
        status: 'in_progress',
        sync_started_at: syncStarted.toISOString(),
      })
      .select()
      .single();

    if (logError) {
      console.error('[CurlingIO] Failed to create sync log:', logError);
      return {
        success: false,
        events_fetched: 0,
        events_created: 0,
        events_updated: 0,
        events_skipped: 0,
        error: logError.message,
      };
    }

    try {
      console.log('[CurlingIO] Fetching events from Curling.io API...');

      // Fetch events from Curling.io
      const eventsData = await interopService.fetch('curlingio', '/events', {
        method: 'GET',
      });

      if (!eventsData || !Array.isArray(eventsData.events)) {
        throw new Error('Invalid response from Curling.io API');
      }

      const events: CurlingIOEvent[] = eventsData.events;
      console.log(`[CurlingIO] Fetched ${events.length} events`);

      let created = 0;
      let updated = 0;
      let skipped = 0;

      // Process each event
      for (const event of events) {
        try {
          const result = await this.syncEvent(supabase, event);
          
          if (result === 'created') created++;
          else if (result === 'updated') updated++;
          else skipped++;
        } catch (error: any) {
          console.error(`[CurlingIO] Failed to sync event ${event.id}:`, error);
          skipped++;
        }
      }

      // Update sync log with success
      await supabase
        .from('event_sync_logs')
        .update({
          status: 'success',
          sync_completed_at: new Date().toISOString(),
          events_fetched: events.length,
          events_created: created,
          events_updated: updated,
          events_skipped: skipped,
        })
        .eq('id', syncLog.id);

      interopService.updateSyncStatus('curlingio', 'success');

      return {
        success: true,
        events_fetched: events.length,
        events_created: created,
        events_updated: updated,
        events_skipped: skipped,
      };
    } catch (error: any) {
      console.error('[CurlingIO] Sync failed:', error);

      // Update sync log with failure
      await supabase
        .from('event_sync_logs')
        .update({
          status: 'failed',
          sync_completed_at: new Date().toISOString(),
          error_message: error.message,
          error_details: { stack: error.stack },
        })
        .eq('id', syncLog.id);

      interopService.updateSyncStatus('curlingio', 'failed');

      return {
        success: false,
        events_fetched: 0,
        events_created: 0,
        events_updated: 0,
        events_skipped: 0,
        error: error.message,
      };
    }
  }

  /**
   * Sync a single event
   */
  private async syncEvent(
    supabase: any,
    curlingIOEvent: CurlingIOEvent
  ): Promise<'created' | 'updated' | 'skipped'> {
    // Check if event already exists by curling_io_id
    const { data: existing } = await supabase
      .from('events')
      .select('id, name, start_date, last_synced_at')
      .eq('curling_io_id', curlingIOEvent.id)
      .single();

    const eventData = {
      name: curlingIOEvent.name,
      start_date: curlingIOEvent.start_date,
      end_date: curlingIOEvent.end_date,
      venue_name: curlingIOEvent.venue?.name || null,
      venue_city: curlingIOEvent.venue?.city || null,
      province: curlingIOEvent.venue?.province || null,
      event_type: curlingIOEvent.event_type,
      registration_fee: curlingIOEvent.registration_fee || null,
      max_participants: curlingIOEvent.max_teams ? curlingIOEvent.max_teams * 4 : null,
      description: curlingIOEvent.description || null,
      curling_io_id: curlingIOEvent.id,
      external_source: 'curlingio',
      last_synced_at: new Date().toISOString(),
    };

    if (existing) {
      // Update existing event
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', existing.id);

      if (error) {
        throw error;
      }

      console.log(`[CurlingIO] Updated event: ${curlingIOEvent.name}`);
      return 'updated';
    } else {
      // Create new event
      const { error } = await supabase
        .from('events')
        .insert(eventData);

      if (error) {
        // Check if it's a duplicate (race condition)
        if (error.code === '23505') {
          return 'skipped';
        }
        throw error;
      }

      console.log(`[CurlingIO] Created event: ${curlingIOEvent.name}`);
      return 'created';
    }
  }

  /**
   * Test connection to Curling.io API
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('[CurlingIO] Testing connection...');
      
      const response = await interopService.fetch('curlingio', '/health', {
        method: 'GET',
      });

      console.log('[CurlingIO] ✅ Connection successful');
      return true;
    } catch (error: any) {
      console.error('[CurlingIO] ❌ Connection failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export const curlingIOSync = new CurlingIOSyncService();
