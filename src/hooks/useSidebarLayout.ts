import { useCallback, useEffect } from 'react';
import { useWorkbench } from './useWorkbench';
import {
  SASH_WIDTH,
  SIDEBAR_MAX,
  SIDEBAR_MIN,
  SPLIT_PANE_MIN,
} from '../data/constants';
import { clamp } from '../utils/clamp';

interface LayoutRefs {
  mainBodyRef: React.RefObject<HTMLElement | null>;
  activityBarRef: React.RefObject<HTMLElement | null>;
}

export interface SidebarLayoutApi {
  applyWidth: (width: number) => void;
  toggleHidden: (hidden: boolean) => void;
  getMaxWidth: () => number;
}

export function useSidebarLayout({
  mainBodyRef,
  activityBarRef,
}: LayoutRefs): SidebarLayoutApi {
  const { state, dispatch } = useWorkbench();
  const {
    panes,
    hiddenPaneIds,
    sidebarWidth,
    sidebarHidden,
  } = state;

  const getEditorMinWidth = useCallback(() => {
    const visible = panes.filter((p) => !hiddenPaneIds.includes(p.id)).length;
    const handles = visible > 1 ? visible - 1 : 0;
    return visible * SPLIT_PANE_MIN + handles * SASH_WIDTH;
  }, [panes, hiddenPaneIds]);

  const getMaxWidth = useCallback(() => {
    const containerW = mainBodyRef.current?.offsetWidth ?? window.innerWidth;
    const activityW = activityBarRef.current?.offsetWidth ?? 0;
    const available =
      containerW - activityW - SASH_WIDTH - getEditorMinWidth();
    return Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, available));
  }, [mainBodyRef, activityBarRef, getEditorMinWidth]);

  const applyWidth = useCallback(
    (width: number) => {
      const clamped = clamp(width, SIDEBAR_MIN, getMaxWidth());
      dispatch({ type: 'SET_SIDEBAR_WIDTH', width: clamped });
    },
    [dispatch, getMaxWidth],
  );

  const toggleHidden = useCallback(
    (hidden: boolean) => {
      dispatch({ type: 'SET_SIDEBAR_HIDDEN', hidden });
    },
    [dispatch],
  );

  useEffect(() => {
    const handleResize = () => {
      if (sidebarHidden) return;
      const max = getMaxWidth();
      if (sidebarWidth > max) {
        dispatch({ type: 'SET_SIDEBAR_WIDTH', width: max });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, getMaxWidth, sidebarHidden, sidebarWidth]);

  return { applyWidth, toggleHidden, getMaxWidth };
}
