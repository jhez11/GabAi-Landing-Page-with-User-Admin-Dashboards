import React from 'react';
import { motion } from 'framer-motion';
interface LogoProps {
  variant?: 'full' | 'icon' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  animated?: boolean;
  className?: string;
}
export function Logo({
  variant = 'full',
  size = 'md',
  color = 'currentColor',
  animated = false,
  className = ''
}: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  // Circuit animation variants
  const circuitVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };
  const assembleVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };
  if (variant === 'icon') {
    return <motion.div className={`${sizes[size]} ${className}`} initial={animated ? 'hidden' : false} animate={animated ? 'visible' : false} variants={assembleVariants}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path d="M50 10 L50 30 M50 70 L50 90 M10 50 L30 50 M70 50 L90 50" stroke={color} strokeWidth="3" strokeLinecap="round" initial={animated ? 'hidden' : false} animate={animated ? 'visible' : false} variants={circuitVariants} />
          <motion.circle cx="50" cy="50" r="25" stroke={color} strokeWidth="4" fill="none" initial={animated ? {
          scale: 0
        } : false} animate={animated ? {
          scale: 1
        } : false} transition={{
          delay: 0.3,
          duration: 0.5
        }} />
          <motion.path d="M 40 45 Q 50 35, 60 45 L 60 60 Q 50 70, 40 60 Z" fill={color} initial={animated ? {
          scale: 0
        } : false} animate={animated ? {
          scale: 1
        } : false} transition={{
          delay: 0.5,
          duration: 0.5
        }} />
        </svg>
      </motion.div>;
  }
  if (variant === 'outline') {
    return <motion.div className={`${sizes[size]} ${className}`} animate={animated ? {
      rotate: 360
    } : {}} transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.circle cx="50" cy="50" r="35" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 4" animate={{
          rotate: 360
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }} />
          <motion.path d="M 40 45 Q 50 35, 60 45 L 60 60 Q 50 70, 40 60 Z" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      </motion.div>;
  }
  // Full variant with circuit details
  return <motion.div className={`${sizes[size]} ${className}`} initial={animated ? 'hidden' : false} animate={animated ? 'visible' : false} variants={assembleVariants}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circuit paths */}
        <motion.path d="M50 5 L50 25 M50 75 L50 95 M5 50 L25 50 M75 50 L95 50" stroke={color} strokeWidth="2" strokeLinecap="round" initial={animated ? 'hidden' : false} animate={animated ? 'visible' : false} variants={circuitVariants} />

        {/* Circuit nodes */}
        <motion.circle cx="50" cy="25" r="3" fill={color} initial={animated ? {
        scale: 0
      } : false} animate={animated ? {
        scale: 1
      } : false} transition={{
        delay: 0.4
      }} />
        <motion.circle cx="50" cy="75" r="3" fill={color} initial={animated ? {
        scale: 0
      } : false} animate={animated ? {
        scale: 1
      } : false} transition={{
        delay: 0.5
      }} />
        <motion.circle cx="25" cy="50" r="3" fill={color} initial={animated ? {
        scale: 0
      } : false} animate={animated ? {
        scale: 1
      } : false} transition={{
        delay: 0.6
      }} />
        <motion.circle cx="75" cy="50" r="3" fill={color} initial={animated ? {
        scale: 0
      } : false} animate={animated ? {
        scale: 1
      } : false} transition={{
        delay: 0.7
      }} />

        {/* Main circle */}
        <motion.circle cx="50" cy="50" r="28" stroke={color} strokeWidth="3" fill="none" initial={animated ? {
        scale: 0
      } : false} animate={animated ? {
        scale: 1
      } : false} transition={{
        delay: 0.8,
        duration: 0.5
      }} />

        {/* G shape */}
        <motion.path d="M 38 43 Q 50 33, 62 43 L 62 58 L 50 58 L 50 50 L 58 50 M 38 58 Q 50 68, 62 58" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={animated ? {
        pathLength: 0,
        opacity: 0
      } : false} animate={animated ? {
        pathLength: 1,
        opacity: 1
      } : false} transition={{
        delay: 1,
        duration: 1
      }} />
      </svg>
    </motion.div>;
}
// Typing indicator using circuit animation
export function LogoTypingIndicator({
  color = 'currentColor'
}: {
  color?: string;
}) {
  return <div className="flex items-center gap-1">
      <motion.div className="w-2 h-2 rounded-full" style={{
      backgroundColor: color
    }} animate={{
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5]
    }} transition={{
      duration: 1,
      repeat: Infinity,
      delay: 0
    }} />
      <motion.div className="w-2 h-2 rounded-full" style={{
      backgroundColor: color
    }} animate={{
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5]
    }} transition={{
      duration: 1,
      repeat: Infinity,
      delay: 0.2
    }} />
      <motion.div className="w-2 h-2 rounded-full" style={{
      backgroundColor: color
    }} animate={{
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5]
    }} transition={{
      duration: 1,
      repeat: Infinity,
      delay: 0.4
    }} />
    </div>;
}
// Loading screen with circuit animation
export function LogoLoadingScreen() {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <Logo variant="full" size="xl" animated color="hsl(var(--primary))" />
        <motion.p className="mt-4 text-sm text-muted-foreground" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.5
      }}>
          Loading GabAi...
        </motion.p>
      </div>
    </div>;
}