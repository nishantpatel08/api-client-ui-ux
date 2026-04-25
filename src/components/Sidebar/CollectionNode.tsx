import { memo, useCallback, type CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import type { FlatCollectionNode } from '../../types';
import { cn } from '../../utils/classNames';
import { MethodBadge } from './MethodBadge';
import { TREE_INDENT_PX } from '../../data/constants';

interface CollectionNodeProps {
  flat: FlatCollectionNode;
  expanded: boolean;
  selected: boolean;
  overlayDepth?: number;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

function CollectionNodeComponent({
  flat,
  expanded,
  selected,
  overlayDepth,
  onToggle,
  onSelect,
}: CollectionNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: flat.id });

  const { node } = flat;
  const isFolder = node.type === 'folder';
  const depth = overlayDepth ?? flat.depth;

  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--tree-depth': depth,
    '--tree-indent-px': `${TREE_INDENT_PX}px`,
  } as CSSProperties;

  const handleSelect = useCallback(() => {
    onSelect(flat.id);
  }, [flat.id, onSelect]);

  const handleToggle = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onToggle(flat.id);
    },
    [flat.id, onToggle],
  );

  const handleRowClick = useCallback(() => {
    onSelect(flat.id);
    if (isFolder) onToggle(flat.id);
  }, [flat.id, isFolder, onSelect, onToggle]);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
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
            <ChevronDown className="tree-row__chevron-icon" aria-hidden="true" />
          ) : (
            <ChevronRight className="tree-row__chevron-icon" aria-hidden="true" />
          )}
        </button>
      ) : (
        <span className="tree-row__chevron tree-row__chevron--leaf" aria-hidden="true" />
      )}

      <span className="tree-row__marker" aria-hidden="true">
        {isFolder ? (
          <Folder className="tree-row__folder-icon" aria-hidden="true" />
        ) : (
          <MethodBadge method={node.method} />
        )}
      </span>

      <span
        className="tree-row__label"
        title={node.name}
        onClick={handleSelect}
      >
        {node.name}
      </span>
    </div>
  );
}

export const CollectionNode = memo(CollectionNodeComponent);
