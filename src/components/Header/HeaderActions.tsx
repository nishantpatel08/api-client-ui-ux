import { memo, useCallback } from 'react';
import { useWorkbench } from '../../hooks/useWorkbench';
import { IconButton } from '@/components/ui/icon-button';
import { Codicon } from '@/components/ui/codicon';

function HeaderActionsComponent() {
  const { state, dispatch } = useWorkbench();
  const { sidebarHidden } = state;

  const handleToggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, [dispatch]);

  return (
    <div className="header__actions" aria-label="Header actions">
      <IconButton
        onClick={handleToggleSidebar}
        aria-label={sidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
        aria-pressed={!sidebarHidden}
        title={sidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
      >
        <Codicon name="layout-sidebar-left" className="header__action-icon" aria-hidden="true" />
      </IconButton>
      <IconButton
        aria-label="Toggle secondary panel"
        title="Toggle secondary panel"
        disabled
      >
        <Codicon name="layout-sidebar-right" className="header__action-icon" aria-hidden="true" />
      </IconButton>
    </div>
  );
}

export const HeaderActions = memo(HeaderActionsComponent);
