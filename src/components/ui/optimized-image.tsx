'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Skeleton } from './skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'cover';
}

const aspectRatioClasses = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-video',
  cover: 'aspect-[2/3]',
};

/**
 * Optimized image component with lazy loading and error handling
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/images/placeholder-cover.jpg',
  aspectRatio,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageSrc = error ? fallbackSrc : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
        aspectRatio && aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {isLoading ? <Skeleton className="absolute inset-0" /> : null}
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        sizes={fill ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined}
      />
    </div>
  );
}

/**
 * Avatar image with fallback
 */
export function Avatar({
  src,
  alt,
  size = 'md',
  className,
}: {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white',
          sizeClasses[size],
          className
        )}
      >
        <span className="text-sm font-medium">{alt.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-full', sizeClasses[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes="64px"
      />
    </div>
  );
}

/**
 * Novel cover image with proper aspect ratio
 */
export function NovelCover({
  src,
  title,
  size = 'md',
  className,
  priority = false,
}: {
  src?: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}) {
  const sizeClasses = {
    sm: 'h-24 w-16',
    md: 'h-32 w-24',
    lg: 'h-48 w-36',
  };

  return (
    <div className={cn('relative overflow-hidden rounded-md', sizeClasses[size], className)}>
      {src ? (
        <OptimizedImage
          src={src}
          alt={title}
          fill
          priority={priority}
          className="object-cover"
          fallbackSrc="/images/placeholder-cover.jpg"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          <span className="px-2 text-center text-xs text-gray-500 dark:text-gray-400">
            {title.slice(0, 20)}
          </span>
        </div>
      )}
    </div>
  );
}
