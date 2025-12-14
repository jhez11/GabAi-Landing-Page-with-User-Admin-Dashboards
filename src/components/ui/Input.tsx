import React, { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  label,
  error,
  icon,
  rightIcon,
  onRightIconClick,
  ...props
}, ref) => {
  return <div className="w-full">
        {label && <label className="mb-2 block text-sm font-medium text-foreground">
            {label}
          </label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>}
          <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-destructive focus-visible:ring-destructive' : ''} ${className}`} ref={ref} {...props} />
          {rightIcon && <button type="button" onClick={onRightIconClick} className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'}`} tabIndex={-1}>
              {rightIcon}
            </button>}
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>;
});
Input.displayName = 'Input';