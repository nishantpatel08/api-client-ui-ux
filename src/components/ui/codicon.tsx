import { memo, type AriaAttributes } from 'react';
import { cn } from '../../utils/classNames';

interface CodiconProps {
  name: string;
  className?: string;
  'aria-hidden'?: AriaAttributes['aria-hidden'];
}

function CodiconComponent({
  name,
  className,
  'aria-hidden': ariaHidden = true,
}: CodiconProps) {
  return (
    <i
      className={cn('codicon', `codicon-${name}`, className)}
      aria-hidden={ariaHidden}
    />
  );
}

export const Codicon = memo(CodiconComponent);
