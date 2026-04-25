import { memo, useCallback } from 'react';
import {
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { IconButton } from '../ui/icon-button';
import { useAppDispatch } from '../../store/hooks';
import { addFolder, addRequest } from '../../store/slices/collectionsSlice';

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
          <FilePlus className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
        <IconButton
          onClick={handleAddFolder}
          aria-label="New folder"
          title="New folder"
          className="sidebar__header-btn"
        >
          <FolderPlus className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
        <IconButton
          aria-label="Refresh"
          title="Refresh"
          className="sidebar__header-btn"
        >
          <RefreshCw className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
        <IconButton
          aria-label="More actions"
          title="More actions"
          className="sidebar__header-btn"
        >
          <MoreHorizontal className="sidebar__header-icon" aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}

export const SidebarHeader = memo(SidebarHeaderComponent);
