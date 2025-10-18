import { useState, useEffect, useRef } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
  aspectRatio?: string;
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  onClick,
  priority = false,
  aspectRatio = '1/1'
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-100`}
      style={{ aspectRatio }}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="flex flex-col items-center">
            <div className="animate-pulse rounded-full h-8 w-8 bg-rose-300 mb-2"></div>
          </div>
        </div>
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-all duration-500 ${
            isLoaded
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
          style={{
            contentVisibility: 'auto',
            contain: 'paint'
          }}
        />
      )}
    </div>
  );
}
