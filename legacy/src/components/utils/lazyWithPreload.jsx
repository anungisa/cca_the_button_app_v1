/**
 * Enhanced Lazy Loading with Preload Support
 * Allows components to be preloaded on hover/focus
 */

import { lazy } from 'react';

export function lazyWithPreload(importFunc) {
  const LazyComponent = lazy(importFunc);
  LazyComponent.preload = importFunc;
  return LazyComponent;
}

export default lazyWithPreload;