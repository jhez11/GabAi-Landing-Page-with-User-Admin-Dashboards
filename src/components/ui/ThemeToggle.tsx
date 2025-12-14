import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
export function ThemeToggle() {
  const {
    theme,
    setTheme
  } = useTheme();
  return <div className="flex items-center rounded-full border border-border bg-background p-1">
      <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setTheme('light')} aria-label="Light mode">
        <Sun className="h-4 w-4" />
      </Button>
      <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setTheme('system')} aria-label="System mode">
        <Laptop className="h-4 w-4" />
      </Button>
      <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setTheme('dark')} aria-label="Dark mode">
        <Moon className="h-4 w-4" />
      </Button>
    </div>;
}