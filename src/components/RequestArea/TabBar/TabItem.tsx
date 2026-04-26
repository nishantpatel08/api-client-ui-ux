import { memo, useCallback, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { RequestTab } from '../../../types';
import { cn } from '../../../utils/classNames';

interface TabItemProps {
  tab: RequestTab;
  active: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

function TabItemComponent({ tab, active, onSelect, onClose }: TabItemProps) {
  const handleClick = useCallback(() => onSelect(tab.id), [onSelect, tab.id]);

  const handleClose = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClose(tab.id);
    },
    [onClose, tab.id],
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.button === 1) {
        event.preventDefault();
        onClose(tab.id);
      }
    },
    [onClose, tab.id],
  );

  return (
    <div
      role="tab"
      aria-selected={active}
      className={cn('tab-item', active && 'tab-item--active')}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      title={tab.name}
    >
      <span
        className="tab-item__method"
        data-method={tab.method}
        aria-hidden="true"
      >
        {tab.method}
      </span>
      <span className="tab-item__label">{tab.name}</span>
      <button
        type="button"
        className="tab-item__close"
        onClick={handleClose}
        aria-label={`Close ${tab.name}`}
      >
        <X className="tab-item__close-icon" />
      </button>
    </div>
  );
}

export const TabItem = memo(TabItemComponent);
