import { memo, useCallback } from 'react';
import { IconButton } from '@/components/ui/icon-button';
import { Codicon } from '@/components/ui/codicon';
import { useAppDispatch } from '../../store/hooks';
import {
  addFolder,
  addRequest,
  collapseAll,
} from '../../store/slices/collectionsSlice';

interface SidebarHeaderProps {
  title: string;
}

function SidebarHeaderComponent({ title }: SidebarHeaderProps) {
  const dispatch = useAppDispatch();

  const handleAddRequest = useCallback(() => {
    dispatch(addRequest({ parentId: null, method: 'GET' }));
  }, [dispatch]);

  const handleAddFolder = useCallback(() => {
    dispatch(addFolder({ parentId: null }));
  }, [dispatch]);

  const handleCollapseAll = useCallback(() => {
    dispatch(collapseAll());
  }, [dispatch]);

  return (
    <div className="sidebar__header">
      <span className="sidebar__header-title">{title}</span>
      <div className="sidebar__header-actions">
        <IconButton
          onClick={handleAddRequest}
          aria-label="New request"
          title="New request"
          className="sidebar__header-btn"
        >
          <Codicon name="new-file" className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
        <IconButton
          onClick={handleAddFolder}
          aria-label="New folder"
          title="New folder"
          className="sidebar__header-btn"
        >
          <Codicon name="new-folder" className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
        <IconButton
          onClick={handleCollapseAll}
          aria-label="Collapse all"
          title="Collapse all"
          className="sidebar__header-btn"
        >
          <Codicon name="collapse-all" className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
        <IconButton
          aria-label="More actions"
          title="More actions"
          className="sidebar__header-btn"
        >
          <Codicon name="ellipsis" className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}

export const SidebarHeader = memo(SidebarHeaderComponent);
