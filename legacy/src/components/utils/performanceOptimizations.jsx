/**
 * Performance Optimization Utilities
 * Implements frontend performance best practices
 */

// Image lazy loading with IntersectionObserver
export const setupLazyImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px' // Start loading 50px before image enters viewport
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Debounce function for search/input handlers
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Throttle function for scroll/resize handlers
export const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization helper
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Request Animation Frame helper for smooth animations
export const rafThrottle = (fn) => {
  let rafId = null;
  return (...args) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
};

// Bundle size optimization - dynamic imports
export const loadComponent = async (componentPath) => {
  try {
    const module = await import(`../${componentPath}`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return null;
  }
};

// Critical CSS injection
export const injectCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Preload critical resources
export const preloadResources = (resources) => {
  resources.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
};

// Web Worker helper for heavy computations
export const offloadToWorker = (fn, data) => {
  return new Promise((resolve, reject) => {
    const workerCode = `
      self.onmessage = function(e) {
        try {
          const fn = ${fn.toString()};
          const result = fn(e.data);
          self.postMessage({ success: true, result });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error));
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage(data);
  });
};