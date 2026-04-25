import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, active, type = 'button', ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        data-active={active ? 'true' : undefined}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
          active && 'bg-white/10 text-[var(--color-foreground)] hover:bg-white/10',
          className,
        )}
        {...props}
      />
    );
  },
);
