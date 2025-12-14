import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
interface CardProps extends HTMLMotionProps<'div'> {
  hover?: boolean;
}
export function Card({
  className = '',
  children,
  hover = false,
  ...props
}: CardProps) {
  return <motion.div className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`} whileHover={hover ? {
    y: -4,
    transition: {
      duration: 0.2
    }
  } : undefined} {...props}>
      {children}
    </motion.div>;
}
export function CardHeader({
  className = '',
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>;
}
export function CardTitle({
  className = '',
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>;
}
export function CardContent({
  className = '',
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
export function CardFooter({
  className = '',
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>;
}