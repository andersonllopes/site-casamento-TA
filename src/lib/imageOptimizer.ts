export const getOptimizedImageUrl = (src: string, width?: number): string => {
  if (src.includes('pexels.com')) {
    const url = new URL(src);
    if (width) {
      url.searchParams.set('w', width.toString());
    }
    url.searchParams.set('auto', 'compress');
    url.searchParams.set('cs', 'tinysrgb');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }

  return src;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (sources: string[]): Promise<void> => {
  await Promise.all(sources.map(src => preloadImage(src)));
};

export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isSlowConnection = (): boolean => {
  const connection = (navigator as any).connection;
  if (!connection) return false;

  const slowTypes = ['slow-2g', '2g', '3g'];
  return slowTypes.includes(connection.effectiveType);
};

export const shouldLoadLowQuality = (): boolean => {
  return isMobileDevice() || isSlowConnection();
};
