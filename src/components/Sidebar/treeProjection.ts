import type { FlatCollectionNode } from '../../types';

export interface DropProjection {
  parentId: string | null;
  targetIndex: number;
  depth: number;
}

interface ProjectionInput {
  flat: FlatCollectionNode[];
  activeId: string;
  overId: string;
  offsetX: number;
  indentPx: number;
}

export function getDropProjection({
  flat,
  activeId,
  overId,
  offsetX,
  indentPx,
}: ProjectionInput): DropProjection | null {
  const overIndex = flat.findIndex((n) => n.id === overId);
  if (overIndex < 0) return null;

  const filtered = flat.filter((n) => n.id !== activeId);
  const activeIndex = flat.findIndex((n) => n.id === activeId);
  const overFilteredIndex = filtered.findIndex((n) => n.id === overId);
  if (overFilteredIndex < 0) return null;

  const overNode = filtered[overFilteredIndex];
  const previousNode = filtered[overFilteredIndex - 1];
  const nextNode = filtered[overFilteredIndex + 1];

  const draggedDepth = Math.round(offsetX / indentPx);

  const movingDown = activeIndex !== -1 && activeIndex < overIndex;
  const baseDepth = movingDown ? nextNode?.depth ?? 0 : overNode.depth;
  const projectedDepth = Math.max(0, baseDepth + draggedDepth);

  const maxDepth = previousNode
    ? previousNode.node.type === 'folder'
      ? previousNode.depth + 1
      : previousNode.depth
    : 0;
  const minDepth = nextNode ? nextNode.depth : 0;

  const depth = Math.min(Math.max(projectedDepth, minDepth), maxDepth);

  let parentId: string | null = null;
  if (depth > 0 && previousNode) {
    if (depth === previousNode.depth + 1 && previousNode.node.type === 'folder') {
      parentId = previousNode.id;
    } else if (depth <= previousNode.depth) {
      let cursor = previousNode;
      while (cursor.depth >= depth) {
        const parent = cursor.parentId
          ? filtered.find((n) => n.id === cursor.parentId)
          : null;
        if (!parent) {
          parentId = cursor.parentId;
          break;
        }
        if (parent.depth + 1 === depth) {
          parentId = parent.id;
          break;
        }
        cursor = parent;
      }
    }
  }

  const sliceEnd = overFilteredIndex + (movingDown ? 1 : 0);
  const targetIndex = filtered
    .slice(0, sliceEnd)
    .filter((n) => n.parentId === parentId).length;

  return { parentId, targetIndex, depth };
}
