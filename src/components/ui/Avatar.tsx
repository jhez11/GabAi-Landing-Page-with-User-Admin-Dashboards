import React from 'react';
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className = ''
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg'
  };
  return <div className={`relative flex shrink-0 overflow-hidden rounded-full ${sizes[size]} ${className}`}>
      {src ? <img className="aspect-square h-full w-full object-cover" src={src} alt={alt || fallback} /> : <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
          {fallback.substring(0, 2).toUpperCase()}
        </div>}
    </div>;
}