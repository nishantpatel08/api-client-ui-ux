import { useCallback, useEffect } from 'react';
import { useWorkbench } from './useWorkbench';
import {
  EDITOR_AREA_MIN,
  SASH_WIDTH,
  SIDEBAR_MAX,
  SIDEBAR_MIN,
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
  const { sidebarWidth, sidebarHidden } = state;

  const getMaxWidth = useCallback(() => {
    const containerW = mainBodyRef.current?.offsetWidth ?? window.innerWidth;
    const activityW = activityBarRef.current?.offsetWidth ?? 0;
    const available = containerW - activityW - SASH_WIDTH - EDITOR_AREA_MIN;
    return Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, available));
  }, [mainBodyRef, activityBarRef]);

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
