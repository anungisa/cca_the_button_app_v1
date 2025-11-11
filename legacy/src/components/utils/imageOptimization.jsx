/**
 * Image Optimization Utilities
 * Provides optimized image loading with WebP support and lazy loading
 */

export const getOptimizedImageUrl = (url, options = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // If it's an Unsplash URL, add optimization params
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width);
    if (height) params.append('h', height);
    params.append('q', quality);
    params.append('fm', format);
    params.append('fit', 'crop');
    
    return `${url}&${params.toString()}`;
  }
  
  return url;
};

export const ImageComponent = ({ src, alt, className, width, height, priority = false }) => {
  const optimizedSrc = getOptimizedImageUrl(src, { width, height });
  
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      width={width}
      height={height}
    />
  );
};

export default { getOptimizedImageUrl, ImageComponent };