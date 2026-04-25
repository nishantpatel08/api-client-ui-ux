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
  const activeIndex = flat.findIndex((n) => n.id === activeId);
  const overIndex = flat.findIndex((n) => n.id === overId);
  if (activeIndex < 0 || overIndex < 0) return null;

  const activeNode = flat[activeIndex];
  const filtered = flat.filter((n) => n.id !== activeId);
  const overFilteredIndex = filtered.findIndex((n) => n.id === overId);
  if (overFilteredIndex < 0) return null;

  const movingDown = activeIndex < overIndex;
  const insertionIndex = movingDown ? overFilteredIndex + 1 : overFilteredIndex;
  const previousItem = filtered[insertionIndex - 1];
  const nextItem = filtered[insertionIndex];

  const dragDepth = Math.round(offsetX / indentPx);
  const projectedDepth = Math.max(0, activeNode.depth + dragDepth);

  const maxDepth = previousItem
    ? previousItem.node.type === 'folder'
      ? previousItem.depth + 1
      : previousItem.depth
    : 0;
  const minDepth = nextItem ? nextItem.depth : 0;

  const depth = Math.min(Math.max(projectedDepth, minDepth), maxDepth);

  let parentId: string | null = null;
  if (depth > 0 && previousItem) {
    if (depth === previousItem.depth + 1) {
      parentId =
        previousItem.node.type === 'folder'
          ? previousItem.id
          : previousItem.parentId;
    } else if (depth <= previousItem.depth) {
      let cursor: FlatCollectionNode | undefined = previousItem;
      while (cursor && cursor.depth >= depth) {
        cursor = cursor.parentId
          ? filtered.find((n) => n.id === cursor!.parentId)
          : undefined;
      }
      parentId = cursor ? cursor.id : null;
    }
  }

  const targetIndex = filtered
    .slice(0, insertionIndex)
    .filter((n) => n.parentId === parentId).length;

  return { parentId, targetIndex, depth };
}
