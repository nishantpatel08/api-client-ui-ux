import {
  memo,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FlatCollectionNode } from '../../types';
import { cn } from '../../utils/classNames';
import { MethodBadge } from './MethodBadge';
import { NodeContextMenu } from './NodeContextMenu';
import { TREE_INDENT_PX } from '../../data/constants';
import { Codicon } from '@/components/ui/codicon';

interface CollectionNodeProps {
  flat: FlatCollectionNode;
  expanded: boolean;
  selected: boolean;
  renaming?: boolean;
  overlayDepth?: number;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onStartRename?: (id: string) => void;
  onCommitRename?: (id: string, name: string) => void;
  onCancelRename?: () => void;
  onAddRequest?: (parentId: string) => void;
  onAddFolder?: (parentId: string) => void;
  onRequestDelete?: (id: string) => void;
}

function CollectionNodeComponent({
  flat,
  expanded,
  selected,
  renaming = false,
  overlayDepth,
  onToggle,
  onSelect,
  onStartRename,
  onCommitRename,
  onCancelRename,
  onAddRequest,
  onAddFolder,
  onRequestDelete,
}: CollectionNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: flat.id, disabled: renaming });

  const { node } = flat;
  const isFolder = node.type === 'folder';
  const depth = overlayDepth ?? flat.depth;

  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--tree-depth': depth,
    '--tree-indent-px': `${TREE_INDENT_PX}px`,
  } as CSSProperties;

  const inputRef = useRef<HTMLInputElement>(null);
  const committedRef = useRef(false);

  useEffect(() => {
    if (!renaming) return;
    committedRef.current = false;
    const input = inputRef.current;
    if (!input) return;
    input.value = node.name;
    input.focus();
    const dot = node.name.lastIndexOf('.');
    if (dot > 0) {
      input.setSelectionRange(0, dot);
    } else {
      input.select();
    }
  }, [renaming, node.name]);

  const commitRename = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;
    const value = inputRef.current?.value ?? '';
    const trimmed = value.trim();
    if (!trimmed || trimmed === node.name) {
      onCancelRename?.();
      return;
    }
    onCommitRename?.(flat.id, trimmed);
  }, [flat.id, node.name, onCancelRename, onCommitRename]);

  const cancelRename = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;
    onCancelRename?.();
  }, [onCancelRename]);

  useEffect(() => {
    if (!renaming) return;
    const input = inputRef.current;
    if (!input) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && input.contains(event.target)) {
        return;
      }
      commitRename();
    };

    const timer = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown, true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [renaming, commitRename]);

  const handleSelect = useCallback(() => {
    if (renaming) return;
    onSelect(flat.id);
  }, [flat.id, onSelect, renaming]);

  const handleToggle = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (renaming) return;
      onToggle(flat.id);
    },
    [flat.id, onToggle, renaming],
  );

  const handleRowClick = useCallback(() => {
    if (renaming) return;
    onSelect(flat.id);
    if (isFolder) onToggle(flat.id);
  }, [flat.id, isFolder, onSelect, onToggle, renaming]);

  const handleInputKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        event.preventDefault();
        commitRename();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        cancelRename();
      }
    },
    [cancelRename, commitRename],
  );

  const handleInputBlur = useCallback(() => {
    if (renaming) commitRename();
  }, [commitRename, renaming]);

  const handleStartRename = useCallback(() => {
    onStartRename?.(flat.id);
  }, [flat.id, onStartRename]);

  const handleAddRequest = useCallback(() => {
    if (isFolder) onAddRequest?.(flat.id);
  }, [flat.id, isFolder, onAddRequest]);

  const handleAddFolder = useCallback(() => {
    if (isFolder) onAddFolder?.(flat.id);
  }, [flat.id, isFolder, onAddFolder]);

  const handleDelete = useCallback(() => {
    onRequestDelete?.(flat.id);
  }, [flat.id, onRequestDelete]);

  const dragListeners = renaming ? undefined : listeners;
  const dragAttributes = renaming ? undefined : attributes;

  return (
    <NodeContextMenu
      isFolder={isFolder}
      onAddRequest={isFolder ? handleAddRequest : undefined}
      onAddFolder={isFolder ? handleAddFolder : undefined}
      onRename={handleStartRename}
      onDelete={handleDelete}
    >
      <div
        ref={setNodeRef}
        {...dragAttributes}
        {...dragListeners}
        role="treeitem"
        aria-level={depth + 1}
        aria-selected={selected || undefined}
        aria-expanded={isFolder ? expanded : undefined}
        aria-label={node.name}
        data-dragging={isDragging ? 'true' : undefined}
        className={cn(
          'tree-row',
          selected && 'tree-row--selected',
          isDragging && 'tree-row--dragging',
          renaming && 'tree-row--renaming',
        )}
        style={rowStyle}
        onClick={handleRowClick}
      >
        <span className="tree-row__indent" aria-hidden="true" />

        {isFolder ? (
          <button
            type="button"
            className="tree-row__chevron"
            onClick={handleToggle}
            aria-label={expanded ? 'Collapse folder' : 'Expand folder'}
            tabIndex={-1}
          >
            {expanded ? (
              <Codicon name="chevron-down" className="tree-row__chevron-icon" aria-hidden="true" />
            ) : (
              <Codicon name="chevron-right" className="tree-row__chevron-icon" aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className="tree-row__chevron tree-row__chevron--leaf" aria-hidden="true" />
        )}

        <span className="tree-row__marker" aria-hidden="true">
          {isFolder ? (
            <Codicon name="folder" className="tree-row__folder-icon" aria-hidden="true" />
          ) : (
            <MethodBadge method={node.method} />
          )}
        </span>

        {renaming ? (
          <input
            ref={inputRef}
            className="tree-row__rename-input"
            defaultValue={node.name}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Rename"
            spellCheck={false}
          />
        ) : (
          <span
            className="tree-row__label"
            title={node.name}
            onClick={handleSelect}
          >
            {node.name}
          </span>
        )}
      </div>
    </NodeContextMenu>
  );
}

export const CollectionNode = memo(CollectionNodeComponent);
