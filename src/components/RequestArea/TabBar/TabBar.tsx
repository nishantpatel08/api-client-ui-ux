import { memo, useCallback, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ChevronDown, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  closeTab,
  createDraftTabAction,
  setActiveTab,
} from '../../../store/slices/requestTabsSlice';
import { DRAG_TAB_TARGET_ID } from '../../../data/constants';
import { cn } from '../../../utils/classNames';
import { useWorkbenchDnd } from '../../../hooks/useWorkbenchDnd';
import { TabItem } from './TabItem';
import './TabBar.css';

function TabBarComponent() {
  const dispatch = useAppDispatch();
  const tabs = useAppSelector((state) => state.requestTabs.tabs);
  const activeTabId = useAppSelector((state) => state.requestTabs.activeTabId);

  const listRef = useRef<HTMLDivElement>(null);
  const { activeFlat } = useWorkbenchDnd();
  const isDraggingRequest = activeFlat?.node.type === 'request';

  const { setNodeRef, isOver } = useDroppable({
    id: DRAG_TAB_TARGET_ID,
    disabled: !isDraggingRequest,
  });

  const handleTabClick = useCallback(
    (id: string) => dispatch(setActiveTab(id)),
    [dispatch],
  );

  const handleTabClose = useCallback(
    (id: string) => dispatch(closeTab(id)),
    [dispatch],
  );

  const handleAdd = useCallback(
    () => dispatch(createDraftTabAction()),
    [dispatch],
  );

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    const el = listRef.current;
    if (!el) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      el.scrollLeft += event.deltaY;
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'tabbar',
        isOver && isDraggingRequest && 'tabbar--drop-target',
      )}
      role="tablist"
      aria-label="Open requests"
    >
      <div
        ref={listRef}
        className="tabbar__list"
        onWheel={handleWheel}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            onSelect={handleTabClick}
            onClose={handleTabClose}
          />
        ))}
        <button
          type="button"
          className="tabbar__add"
          onClick={handleAdd}
          aria-label="New request"
          title="New request"
        >
          <Plus className="tabbar__add-icon" />
        </button>
      </div>

      <div className="tabbar__right">
        <button
          type="button"
          className="tabbar__overflow"
          aria-label="Open request list"
          title="Open request list"
        >
          <ChevronDown className="tabbar__overflow-icon" />
        </button>
        <div className="tabbar__separator" aria-hidden="true" />
        <button
          type="button"
          className="tabbar__env"
          aria-label="Environment: Dev"
          title="Environment"
        >
          <span className="tabbar__env-label">Dev</span>
          <ChevronDown className="tabbar__env-icon" />
        </button>
      </div>
    </div>
  );
}

export const TabBar = memo(TabBarComponent);
