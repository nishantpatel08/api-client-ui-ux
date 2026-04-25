import { forwardRef, memo, useEffect, useMemo, useRef } from 'react';
import { useWorkbench } from '../../hooks/useWorkbench';
import { cn } from '../../utils/classNames';
import { SidebarHeader } from './SidebarHeader';
import { CollectionTree } from './CollectionTree';
import {
  ACTIVITY_COLLECTIONS,
  ACTIVITY_ENVIRONMENTS,
  ACTIVITY_HISTORY,
  ACTIVITY_SCM,
  ACTIVITY_SEARCH,
  ACTIVITY_SETTINGS,
} from '../../data/constants';
import './Sidebar.css';

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    }
  };
}

const ACTIVITY_TITLES: Record<string, string> = {
  [ACTIVITY_COLLECTIONS]: 'Collections',
  [ACTIVITY_SEARCH]: 'Search',
  [ACTIVITY_ENVIRONMENTS]: 'Environments',
  [ACTIVITY_SCM]: 'Source Control',
  [ACTIVITY_HISTORY]: 'History',
  [ACTIVITY_SETTINGS]: 'Settings',
};

const SidebarComponent = forwardRef<HTMLElement>(function Sidebar(_props, ref) {
  const { state } = useWorkbench();
  const { sidebarWidth, sidebarHidden, activeActivity } = state;
  const localRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = localRef.current;
    if (!node) return;
    if (sidebarHidden) {
      node.style.width = '0px';
    } else {
      node.style.width = `${sidebarWidth}px`;
    }
  }, [sidebarHidden, sidebarWidth]);

  const title = useMemo(
    () => ACTIVITY_TITLES[activeActivity] ?? 'Collections',
    [activeActivity],
  );

  return (
    <aside
      ref={mergeRefs(ref, localRef)}
      className={cn('sidebar', sidebarHidden && 'sidebar--hidden')}
      aria-label="Primary Side Bar"
    >
      <SidebarHeader title={title} />
      {activeActivity === ACTIVITY_COLLECTIONS ? (
        <CollectionTree />
      ) : (
        <div className="sidebar__placeholder">
          <p className="sidebar__placeholder-text">
            {title} panel coming soon
          </p>
        </div>
      )}
    </aside>
  );
});

export const Sidebar = memo(SidebarComponent);
