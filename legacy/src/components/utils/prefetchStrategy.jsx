/**
 * Prefetch Strategy
 * Intelligently prefetches data and code based on user behavior
 */

import { ROUTE_REGISTRY } from './routeConfig';
import { enhancedEntityService } from '../services/EnhancedEntityService';

class PrefetchStrategy {
  constructor() {
    this.prefetchedRoutes = new Set();
    this.prefetchedData = new Set();
  }

  // Prefetch route component on link hover
  prefetchRoute(routeName) {
    if (this.prefetchedRoutes.has(routeName)) return;

    // Normalize route name to path format
    const routePath = routeName.startsWith('/') ? routeName : `/${routeName}`;
    const routeConfig = ROUTE_REGISTRY[routePath];

    if (routeConfig && routeConfig.component) {
      // Trigger preload if available
      if (routeConfig.component.preload) {
        routeConfig.component.preload();
      }
      this.prefetchedRoutes.add(routeName);
      console.log(`Prefetched route: ${routeName}`);
    }
  }

  // Prefetch data for common user flows
  async prefetchCommonData(user) {
    if (!user) return;

    const prefetchTasks = [];

    // Always prefetch user's home club data
    if (user.home_club_id && !this.prefetchedData.has(`club-${user.home_club_id}`)) {
      prefetchTasks.push(
        (async () => {
          try {
            const { Club } = await import('@/api/entities');
            await enhancedEntityService.filter(
              Club,
              { id: user.home_club_id },
              '-created_date',
              1,
              { useCache: true, cacheTTL: 10 }
            );
            this.prefetchedData.add(`club-${user.home_club_id}`);
          } catch (error) {
            console.warn('Failed to prefetch home club:', error);
          }
        })()
      );
    }

    // Prefetch upcoming events
    if (!this.prefetchedData.has('upcoming-events')) {
      prefetchTasks.push(
        (async () => {
          try {
            const { Event } = await import('@/api/entities');
            const now = new Date().toISOString().split('T')[0];
            await enhancedEntityService.filter(
              Event,
              { start_date: { $gte: now } },
              'start_date',
              10,
              { useCache: true, cacheTTL: 5 }
            );
            this.prefetchedData.add('upcoming-events');
          } catch (error) {
            console.warn('Failed to prefetch events:', error);
          }
        })()
      );
    }

    // Prefetch user's loyalty data
    if (!this.prefetchedData.has(`loyalty-${user.id}`)) {
      prefetchTasks.push(
        (async () => {
          try {
            const { LoyaltyProgram } = await import('@/api/entities');
            await enhancedEntityService.filter(
              LoyaltyProgram,
              { user_id: user.id },
              '-created_date',
              1,
              { useCache: true, cacheTTL: 5 }
            );
            this.prefetchedData.add(`loyalty-${user.id}`);
          } catch (error) {
            console.warn('Failed to prefetch loyalty data:', error);
          }
        })()
      );
    }

    await Promise.allSettled(prefetchTasks);
    if (prefetchTasks.length > 0) {
      console.log(`Prefetched ${prefetchTasks.length} data sources`);
    }
  }

  reset() {
    this.prefetchedRoutes.clear();
    this.prefetchedData.clear();
  }
}

export const prefetchStrategy = new PrefetchStrategy();
export default prefetchStrategy;