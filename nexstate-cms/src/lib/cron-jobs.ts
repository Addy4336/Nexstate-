import cron from 'node-cron';
import { supabaseAdmin } from './db';

/**
 * Initialize all cron jobs for the application
 */
export function initializeCronJobs() {
  console.log('Initializing cron jobs...');

  // Update rental statuses daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running rental status update at:', new Date().toISOString());
    
    try {
      const { error } = await supabaseAdmin.rpc('update_property_rental_status');
      
      if (error) {
        console.error('[CRON] Error updating rental statuses:', error);
      } else {
        console.log('[CRON] Rental statuses updated successfully');
      }
    } catch (error) {
      console.error('[CRON] Failed to update rental statuses:', error);
    }
  }, {
    timezone: 'UTC' // Change to your timezone if needed (e.g., 'Asia/Dubai', 'America/New_York')
  });

  console.log('✓ Cron jobs initialized successfully');
  console.log('  - Rental status update: Daily at midnight (00:00 UTC)');
}
