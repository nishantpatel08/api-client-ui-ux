import { useEffect } from 'react';
import { useWorkbench } from './useWorkbench';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useSidebarToggleShortcut() {
  const { dispatch } = useWorkbench();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;
      if (event.key !== 'b' && event.key !== 'B') return;
      event.preventDefault();
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);
}

export interface TreeShortcutHandlers {
  onRename?: () => void;
  onDelete?: () => void;
}

export function useTreeShortcuts({
  onRename,
  onDelete,
}: TreeShortcutHandlers) {
  useEffect(() => {
    if (!onRename && !onDelete) return;

    const handler = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      if (event.key === 'F2' && onRename) {
        event.preventDefault();
        onRename();
        return;
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && onDelete) {
        event.preventDefault();
        onDelete();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDelete, onRename]);
}
