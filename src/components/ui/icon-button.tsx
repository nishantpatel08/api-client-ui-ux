import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/classNames';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const BASE_CLASS = cn(
  'inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-[var(--color-muted-foreground)] transition-colors',
  'hover:bg-white/5 hover:text-[var(--color-foreground)]',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ring)]',
  'disabled:cursor-not-allowed disabled:opacity-50',
);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, active, type = 'button', ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        data-active={active ? 'true' : undefined}
        className={cn(
          BASE_CLASS,
          active && 'bg-white/10 text-[var(--color-foreground)]',
          className,
        )}
        {...props}
      />
    );
  },
);
