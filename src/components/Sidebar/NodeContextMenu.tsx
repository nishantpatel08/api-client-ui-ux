import { memo, type ReactNode } from 'react';
import {
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface NodeContextMenuProps {
  isFolder: boolean;
  onAddRequest?: () => void;
  onAddFolder?: () => void;
  onRename: () => void;
  onDelete: () => void;
  children: ReactNode;
}

function NodeContextMenuComponent({
  isFolder,
  onAddRequest,
  onAddFolder,
  onRename,
  onDelete,
  children,
}: NodeContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {isFolder ? (
          <>
            <ContextMenuItem onSelect={onAddRequest}>
              <FilePlus className="h-4 w-4" aria-hidden="true" />
              <span>Add request</span>
            </ContextMenuItem>
            <ContextMenuItem onSelect={onAddFolder}>
              <FolderPlus className="h-4 w-4" aria-hidden="true" />
              <span>Add folder</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : null}
        <ContextMenuItem onSelect={onRename}>
          <Pencil className="h-4 w-4" aria-hidden="true" />
          <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={onDelete}
          className="text-destructive focus:bg-destructive focus:text-white"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const NodeContextMenu = memo(NodeContextMenuComponent);
