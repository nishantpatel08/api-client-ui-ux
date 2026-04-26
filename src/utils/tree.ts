import type {
  CollectionFolder,
  CollectionNode,
  FlatCollectionNode,
} from '../types';

export function isFolder(node: CollectionNode): node is CollectionFolder {
  return node.type === 'folder';
}

export function findNode(
  tree: CollectionNode[],
  id: string,
): CollectionNode | undefined {
  for (const node of tree) {
    if (node.id === id) return node;
    if (isFolder(node)) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export interface ParentLookup {
  parent: CollectionFolder | null;
  siblings: CollectionNode[];
  index: number;
}

export function findParent(
  tree: CollectionNode[],
  id: string,
): ParentLookup | undefined {
  for (let i = 0; i < tree.length; i += 1) {
    if (tree[i].id === id) {
      return { parent: null, siblings: tree, index: i };
    }
  }

  function recurse(
    parent: CollectionFolder,
  ): ParentLookup | undefined {
    const siblings = parent.children;
    for (let i = 0; i < siblings.length; i += 1) {
      if (siblings[i].id === id) {
        return { parent, siblings, index: i };
      }
      const child = siblings[i];
      if (isFolder(child)) {
        const found = recurse(child);
        if (found) return found;
      }
    }
    return undefined;
  }

  for (const node of tree) {
    if (isFolder(node)) {
      const found = recurse(node);
      if (found) return found;
    }
  }
  return undefined;
}

export function isDescendant(
  tree: CollectionNode[],
  ancestorId: string,
  descendantId: string,
): boolean {
  const ancestor = findNode(tree, ancestorId);
  if (!ancestor || !isFolder(ancestor)) return false;

  function walk(node: CollectionFolder): boolean {
    for (const child of node.children) {
      if (child.id === descendantId) return true;
      if (isFolder(child) && walk(child)) return true;
    }
    return false;
  }

  return walk(ancestor);
}

export function removeNode(
  tree: CollectionNode[],
  id: string,
): { next: CollectionNode[]; removed: CollectionNode | null } {
  let removed: CollectionNode | null = null;

  function recurse(nodes: CollectionNode[]): CollectionNode[] {
    const next: CollectionNode[] = [];
    for (const node of nodes) {
      if (node.id === id) {
        removed = node;
        continue;
      }
      if (isFolder(node)) {
        next.push({ ...node, children: recurse(node.children) });
      } else {
        next.push(node);
      }
    }
    return next;
  }

  const next = recurse(tree);
  return { next, removed };
}

export function insertNode(
  tree: CollectionNode[],
  parentId: string | null,
  index: number,
  node: CollectionNode,
): CollectionNode[] {
  if (parentId === null) {
    const clamped = Math.max(0, Math.min(index, tree.length));
    const next = [...tree];
    next.splice(clamped, 0, node);
    return next;
  }

  function recurse(nodes: CollectionNode[]): CollectionNode[] {
    return nodes.map((current) => {
      if (current.id === parentId && isFolder(current)) {
        const clamped = Math.max(0, Math.min(index, current.children.length));
        const nextChildren = [...current.children];
        nextChildren.splice(clamped, 0, node);
        return { ...current, children: nextChildren };
      }
      if (isFolder(current)) {
        return { ...current, children: recurse(current.children) };
      }
      return current;
    });
  }

  return recurse(tree);
}

export function updateNode(
  tree: CollectionNode[],
  id: string,
  updater: (node: CollectionNode) => CollectionNode,
): CollectionNode[] {
  return tree.map((node) => {
    if (node.id === id) return updater(node);
    if (isFolder(node)) {
      return { ...node, children: updateNode(node.children, id, updater) };
    }
    return node;
  });
}

export function getNodePath(
  tree: CollectionNode[],
  id: string,
): CollectionNode[] {
  const path: CollectionNode[] = [];

  function walk(nodes: CollectionNode[]): boolean {
    for (const node of nodes) {
      if (node.id === id) {
        path.push(node);
        return true;
      }
      if (isFolder(node) && walk(node.children)) {
        path.unshift(node);
        return true;
      }
    }
    return false;
  }

  walk(tree);
  return path;
}

export function flattenVisible(
  tree: CollectionNode[],
  expandedIds: Record<string, boolean>,
): FlatCollectionNode[] {
  const flat: FlatCollectionNode[] = [];

  function walk(
    nodes: CollectionNode[],
    parentId: string | null,
    depth: number,
  ): void {
    nodes.forEach((node, index) => {
      flat.push({ id: node.id, parentId, depth, index, node });
      if (isFolder(node) && expandedIds[node.id]) {
        walk(node.children, node.id, depth + 1);
      }
    });
  }

  walk(tree, null, 0);
  return flat;
}
