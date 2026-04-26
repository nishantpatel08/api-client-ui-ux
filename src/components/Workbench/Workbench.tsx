import { memo, useCallback, useRef } from 'react';
import { useWorkbench } from '../../hooks/useWorkbench';
import { useDragSash } from '../../hooks/useDragSash';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';
import { useSidebarToggleShortcut } from '../../hooks/useKeyboardShortcuts';
import {
  SIDEBAR_MIN,
  SIDEBAR_SNAP_THRESHOLD,
} from '../../data/constants';
import { Header } from '../Header';
import { ActivityBar } from '../ActivityBar';
import { Sidebar } from '../Sidebar';
import { Sash } from '../Sash';
import { RequestArea } from '../RequestArea';
import { StatusBar } from '../StatusBar';
import { WorkbenchDndProvider } from '../WorkbenchDnd';
import './Workbench.css';

function WorkbenchComponent() {
  const { state, dispatch } = useWorkbench();
  const { sidebarWidth, sidebarHidden } = state;

  const mainBodyRef = useRef<HTMLDivElement>(null);
  const activityBarRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const { applyWidth, toggleHidden, getMaxWidth } = useSidebarLayout({
    mainBodyRef,
    activityBarRef,
  });

  const dragStartRef = useRef<{ width: number; hidden: boolean }>({
    width: 0,
    hidden: false,
  });

  const handleDragStart = useCallback(() => {
    dragStartRef.current = {
      width: sidebarHidden ? 0 : sidebarWidth,
      hidden: sidebarHidden,
    };
  }, [sidebarHidden, sidebarWidth]);

  const handleDragMove = useCallback(
    (deltaX: number) => {
      const { width: startWidth } = dragStartRef.current;
      const proposed = startWidth + deltaX;
      const node = sidebarRef.current;
      if (!node) return;

      const max = getMaxWidth();

      if (proposed < SIDEBAR_SNAP_THRESHOLD) {
        node.style.width = '0px';
        return;
      }

      if (proposed < SIDEBAR_MIN) {
        node.style.width = `${proposed}px`;
        return;
      }

      node.style.width = `${Math.min(max, proposed)}px`;
    },
    [getMaxWidth],
  );

  const handleDragEnd = useCallback(() => {
    const { width: startWidth, hidden: startHidden } = dragStartRef.current;
    const node = sidebarRef.current;
    const currentWidth = node ? node.offsetWidth : startWidth;

    if (currentWidth < SIDEBAR_SNAP_THRESHOLD) {
      dispatch({ type: 'SET_SIDEBAR_HIDDEN', hidden: true });
      if (node) node.style.width = '0px';
      return;
    }

    if (startHidden) {
      toggleHidden(false);
    }
    applyWidth(Math.max(SIDEBAR_MIN, currentWidth));
  }, [applyWidth, dispatch, toggleHidden]);

  const { dragging, onMouseDown } = useDragSash({
    onStart: handleDragStart,
    onMove: handleDragMove,
    onEnd: handleDragEnd,
  });

  useSidebarToggleShortcut();

  return (
    <WorkbenchDndProvider>
      <div className="workbench" id="workbench">
        <Header />

        <div className="workbench__body" ref={mainBodyRef} id="main-body">
          <ActivityBar ref={activityBarRef} />
          <Sidebar ref={sidebarRef} />
          <Sash
            dragging={dragging}
            onMouseDown={onMouseDown}
            aria-label="Resize primary side bar"
          />
          <RequestArea />
        </div>

        <StatusBar />
      </div>
    </WorkbenchDndProvider>
  );
}

export const Workbench = memo(WorkbenchComponent);
