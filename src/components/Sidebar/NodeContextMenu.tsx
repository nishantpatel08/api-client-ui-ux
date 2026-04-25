import { memo, type ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Codicon } from '@/components/ui/codicon';

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
              <Codicon name="new-file" className="h-4 w-4" aria-hidden="true" />
              <span>Add request</span>
            </ContextMenuItem>
            <ContextMenuItem onSelect={onAddFolder}>
              <Codicon name="new-folder" className="h-4 w-4" aria-hidden="true" />
              <span>Add folder</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : null}
        <ContextMenuItem onSelect={onRename}>
          <Codicon name="edit" className="h-4 w-4" aria-hidden="true" />
          <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={onDelete}
          className="text-destructive focus:bg-destructive focus:text-white"
        >
          <Codicon name="trash" className="h-4 w-4" aria-hidden="true" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const NodeContextMenu = memo(NodeContextMenuComponent);
