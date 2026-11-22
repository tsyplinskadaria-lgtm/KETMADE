import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  wrapperClassName = '',
  priority = false,
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const hasCustomBg = /\bbg-/.test(wrapperClassName);

  return (
    <div
      className={`relative overflow-hidden ${hasCustomBg ? '' : 'bg-cream'} ${wrapperClassName}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-90'
          }`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-cream via-sand to-cream border border-clay-line"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="w-10 h-10 text-umber/60 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <path d="M18 10h12l-2 7c4 4 6 9 6 15 0 5-3.5 8-10 8s-10-3-10-8c0-6 2-11 6-15l-2-7z" />
            <path d="M17 10c2-1.5 12-1.5 14 0" />
          </svg>
          <span className="font-serif text-lg text-espresso">
            {fallbackTitle || alt}
          </span>
        </div>
      )}
    </div>
  );
}
