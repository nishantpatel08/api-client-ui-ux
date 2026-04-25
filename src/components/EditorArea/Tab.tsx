import { memo, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import './Tab.css';

interface TabProps {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
}

function TabComponent({
  id,
  label,
  icon,
  active,
  onActivate,
  onClose,
}: TabProps) {
  const handleClick = useCallback(() => onActivate(id), [id, onActivate]);

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClose(id);
    },
    [id, onClose],
  );

  return (
    <div
      role="tab"
      aria-selected={active}
      className={cn('tab', active && 'tab--active')}
      onClick={handleClick}
    >
      <span className="tab__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="tab__label">{label}</span>
      <button
        type="button"
        className="tab__close"
        aria-label={`Close ${label}`}
        onClick={handleClose}
      >
        ×
      </button>
    </div>
  );
}

export const Tab = memo(TabComponent);
