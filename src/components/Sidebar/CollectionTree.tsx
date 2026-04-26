import { memo, useCallback, useMemo, useState } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { findNode, flattenVisible } from '../../utils/tree';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addFolder,
  addRequest,
  deleteNode,
  renameNode,
  selectNode,
  toggleExpanded,
} from '../../store/slices/collectionsSlice';
import {
  closeTabForRequest,
  openRequestTab,
  syncRequestName,
} from '../../store/slices/requestTabsSlice';
import { useTreeShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useWorkbenchDnd } from '../../hooks/useWorkbenchDnd';
import { CollectionNode } from './CollectionNode';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import './CollectionTree.css';

interface DeleteTarget {
  id: string;
  name: string;
  isRequest: boolean;
}

function CollectionTreeComponent() {
  const dispatch = useAppDispatch();
  const tree = useAppSelector((state) => state.collections.tree);
  const expandedIds = useAppSelector((state) => state.collections.expandedIds);
  const selectedId = useAppSelector((state) => state.collections.selectedId);

  const flat = useMemo(
    () => flattenVisible(tree, expandedIds),
    [tree, expandedIds],
  );

  const ids = useMemo(() => flat.map((n) => n.id), [flat]);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const { activeFlat, projection } = useWorkbenchDnd();
  const activeId = activeFlat?.id ?? null;

  const handleToggle = useCallback(
    (id: string) => dispatch(toggleExpanded(id)),
    [dispatch],
  );

  const handleSelect = useCallback(
    (id: string) => {
      dispatch(selectNode(id));
      const target = findNode(tree, id);
      if (!target || target.type !== 'request') return;
      dispatch(
        openRequestTab({
          requestId: target.id,
          name: target.name,
          method: target.method,
        }),
      );
    },
    [dispatch, tree],
  );

  const handleStartRename = useCallback(
    (id: string) => {
      setRenamingId(id);
      dispatch(selectNode(id));
    },
    [dispatch],
  );

  const handleCommitRename = useCallback(
    (id: string, name: string) => {
      dispatch(renameNode({ id, name }));
      const target = findNode(tree, id);
      if (target && target.type === 'request') {
        dispatch(syncRequestName({ requestId: id, name }));
      }
      setRenamingId(null);
    },
    [dispatch, tree],
  );

  const handleCancelRename = useCallback(() => {
    setRenamingId(null);
  }, []);

  const handleAddRequest = useCallback(
    (parentId: string) => {
      dispatch(addRequest({ parentId, method: 'GET' }));
    },
    [dispatch],
  );

  const handleAddFolder = useCallback(
    (parentId: string) => {
      dispatch(addFolder({ parentId }));
    },
    [dispatch],
  );

  const handleRequestDelete = useCallback(
    (id: string) => {
      const target = findNode(tree, id);
      if (!target) return;
      setDeleteTarget({
        id,
        name: target.name,
        isRequest: target.type === 'request',
      });
    },
    [tree],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.isRequest) {
      dispatch(closeTabForRequest(deleteTarget.id));
    }
    dispatch(deleteNode(deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget, dispatch]);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setDeleteTarget(null);
  }, []);

  useTreeShortcuts({
    onRename: selectedId
      ? () => {
          setRenamingId(selectedId);
        }
      : undefined,
    onDelete: selectedId
      ? () => {
          const target = findNode(tree, selectedId);
          if (target) {
            setDeleteTarget({
              id: selectedId,
              name: target.name,
              isRequest: target.type === 'request',
            });
          }
        }
      : undefined,
  });

  return (
    <div className="tree" role="tree" aria-label="Collections">
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="tree__rows">
          {flat.map((item) => {
            const isActive = activeId === item.id;
            const overlayDepth =
              isActive && projection ? projection.depth : undefined;
            return (
              <CollectionNode
                key={item.id}
                flat={item}
                expanded={Boolean(expandedIds[item.id])}
                selected={selectedId === item.id}
                renaming={renamingId === item.id}
                overlayDepth={overlayDepth}
                onToggle={handleToggle}
                onSelect={handleSelect}
                onStartRename={handleStartRename}
                onCommitRename={handleCommitRename}
                onCancelRename={handleCancelRename}
                onAddRequest={handleAddRequest}
                onAddFolder={handleAddFolder}
                onRequestDelete={handleRequestDelete}
              />
            );
          })}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeFlat ? (
          <CollectionNode
            flat={activeFlat}
            expanded={Boolean(expandedIds[activeFlat.id])}
            selected
            overlayDepth={projection?.depth ?? activeFlat.depth}
            onToggle={() => undefined}
            onSelect={() => undefined}
          />
        ) : null}
      </DragOverlay>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : ''}
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteDialogOpenChange}
      />
    </div>
  );
}

export const CollectionTree = memo(CollectionTreeComponent);
