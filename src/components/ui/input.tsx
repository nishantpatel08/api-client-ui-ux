import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/classNames';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const INPUT_CLASS = cn(
  'flex h-8 w-full rounded-md border border-transparent bg-[var(--color-input)] px-3 py-1 text-[13px] text-[var(--color-foreground)] shadow-sm transition-colors',
  'placeholder:text-[var(--color-muted-foreground)]',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ring)] focus-visible:border-[var(--color-ring)]',
  'disabled:cursor-not-allowed disabled:opacity-50',
);

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(INPUT_CLASS, className)}
      {...props}
    />
  );
});
