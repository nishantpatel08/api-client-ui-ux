import { memo } from 'react';
import { cn } from '../../utils/classNames';
import './Sash.css';

interface SashProps {
  dragging?: boolean;
  onMouseDown: (event: React.MouseEvent) => void;
  className?: string;
  'aria-label'?: string;
}

function SashComponent({
  dragging,
  onMouseDown,
  className,
  'aria-label': ariaLabel = 'Resize',
}: SashProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      className={cn('sash', dragging && 'sash--dragging', className)}
      onMouseDown={onMouseDown}
    />
  );
}

export const Sash = memo(SashComponent);
