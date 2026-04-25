import { forwardRef, memo, useCallback, useMemo } from 'react';
import { useWorkbench } from '../../hooks/useWorkbench';
import {
  ACTIVITY_BAR_ITEMS,
  ACTIVITY_ICON_MAP,
} from '../../data/activityBarItems';
import { cn } from '../../utils/classNames';
import type { ActivityBarItem } from '../../types';
import './ActivityBar.css';

interface ActivityIconButtonProps {
  item: ActivityBarItem;
  active: boolean;
  onSelect: (id: string) => void;
}

const ActivityIconButton = memo(function ActivityIconButton({
  item,
  active,
  onSelect,
}: ActivityIconButtonProps) {
  const Icon = ACTIVITY_ICON_MAP[item.icon];
  const handleClick = useCallback(() => onSelect(item.id), [item.id, onSelect]);

  return (
    <button
      type="button"
      className={cn('activity-icon', active && 'activity-icon--active')}
      title={item.title}
      aria-label={item.title}
      aria-pressed={active}
      onClick={handleClick}
    >
      {Icon ? <Icon className="activity-icon__svg" aria-hidden="true" /> : null}
    </button>
  );
});

const ActivityBarComponent = forwardRef<HTMLElement>(function ActivityBar(
  _props,
  ref,
) {
  const { state, dispatch } = useWorkbench();
  const { activeActivity, sidebarHidden } = state;

  const handleSelect = useCallback(
    (id: string) => {
      if (id === activeActivity) {
        dispatch({ type: 'TOGGLE_SIDEBAR' });
        return;
      }
      dispatch({ type: 'SET_ACTIVITY', id });
      if (sidebarHidden) {
        dispatch({ type: 'SET_SIDEBAR_HIDDEN', hidden: false });
      }
    },
    [activeActivity, dispatch, sidebarHidden],
  );

  const grouped = useMemo(() => {
    const top: ActivityBarItem[] = [];
    const bottom: ActivityBarItem[] = [];
    for (const item of ACTIVITY_BAR_ITEMS) {
      if (item.position === 'bottom') bottom.push(item);
      else top.push(item);
    }
    return { top, bottom };
  }, []);

  return (
    <aside className="activity-bar" ref={ref} aria-label="Activity Bar">
      <div className="activity-bar__section">
        {grouped.top.map((item) => (
          <ActivityIconButton
            key={item.id}
            item={item}
            active={activeActivity === item.id && !sidebarHidden}
            onSelect={handleSelect}
          />
        ))}
      </div>
      <div className="activity-bar__section activity-bar__section--bottom">
        {grouped.bottom.map((item) => (
          <ActivityIconButton
            key={item.id}
            item={item}
            active={activeActivity === item.id && !sidebarHidden}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </aside>
  );
});

export const ActivityBar = memo(ActivityBarComponent);
