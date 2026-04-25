---
name: Sidebar fixes and polish
overview: Polish the collections sidebar with indent guides, Ctrl+B toggle, a drag-and-drop fix, inline rename, shadcn context menus, delete confirmation, a collapse-all action, and persistence of sidebar width in localStorage plus tree state in IndexedDB.
todos:
  - id: deps
    content: "Add dependencies with yarn: @radix-ui/react-context-menu, @radix-ui/react-dropdown-menu, @radix-ui/react-dialog, idb-keyval."
    status: completed
  - id: indent-guides
    content: Render per-depth indent guide lines in the tree (CSS on .tree-row__indent + new --tree-indent-guide variable).
    status: completed
  - id: shortcut-hook
    content: Add useKeyboardShortcuts hook and wire Ctrl/Cmd+B to TOGGLE_SIDEBAR; F2 and Delete hooks (later step can reuse it).
    status: completed
  - id: activity-toggle
    content: Update ActivityBar click to toggle sidebar on same-icon click and unhide on different-icon click.
    status: completed
  - id: fix-projection
    content: Rewrite treeProjection.ts with canonical arrayMove logic; add explicit 'drop into hovered expanded folder at index 0' case.
    status: completed
  - id: collapse-all
    content: Add collapseAll reducer in collectionsSlice and swap reload icon for a collapse-all button in SidebarHeader.
    status: completed
  - id: persist-width
    content: Persist sidebarWidth and sidebarHidden in localStorage; hydrate on workbench reducer init.
    status: completed
  - id: persist-tree
    content: Add store/persistence.ts using idb-keyval, preload in main.tsx, and subscribe-debounced save in store/index.ts.
    status: completed
  - id: shadcn-primitives
    content: Add src/components/ui/context-menu.tsx and src/components/ui/dialog.tsx (shadcn wrappers).
    status: completed
  - id: context-menu
    content: Wrap tree rows in ContextMenu with folder/request action sets and icons, grouped with separators.
    status: completed
  - id: inline-rename
    content: Implement inline rename input in CollectionNode with autofocus/select-all, Enter/Esc/blur behavior, disabled drag while editing.
    status: completed
  - id: delete-confirm
    content: Add ConfirmDialog reused by CollectionTree; wire delete action through it (context menu + Delete key).
    status: completed
isProject: false
---

## Scope

Ten changes, all scoped to the sidebar / workbench layer. No changes to the editor area, tabs, status bar, or activity bar items themselves (except click-behavior).

## 1. Indent guides in the tree

File: [vscode-ui/src/components/Sidebar/CollectionNode.tsx](vscode-ui/src/components/Sidebar/CollectionNode.tsx) + [vscode-ui/src/components/Sidebar/CollectionTree.css](vscode-ui/src/components/Sidebar/CollectionTree.css).

Render `depth` vertical guides inside `.tree-row__indent` using a stacked `repeating-linear-gradient` or one absolutely-positioned `<span>` per level. Preferred: single gradient driven by the `--tree-depth` and `--tree-indent-px` CSS vars already set on the row.

```css
.tree-row__indent {
  background-image: repeating-linear-gradient(
    to right,
    var(--tree-indent-guide) 0,
    var(--tree-indent-guide) 1px,
    transparent 1px,
    transparent var(--tree-indent-px, 12px)
  );
}
```

Add `--tree-indent-guide: #2b2b2b` to [vscode-ui/src/styles/variables.css](vscode-ui/src/styles/variables.css).

## 2. Sidebar toggle via Ctrl+B and Activity Bar

- Global shortcut: new hook `vscode-ui/src/hooks/useKeyboardShortcuts.ts` attaching a `keydown` listener on `window`; on `(ctrlKey || metaKey) && key === 'b'` dispatch `{ type: 'TOGGLE_SIDEBAR' }`. Wire it from [vscode-ui/src/components/Workbench/Workbench.tsx](vscode-ui/src/components/Workbench/Workbench.tsx).
- Activity Bar click behavior in [vscode-ui/src/components/ActivityBar/ActivityBar.tsx](vscode-ui/src/components/ActivityBar/ActivityBar.tsx): if the clicked icon is already the active activity, dispatch `TOGGLE_SIDEBAR`; if sidebar is hidden and a different icon is clicked, dispatch both `SET_ACTIVITY` and `SET_SIDEBAR_HIDDEN:false`.

## 3. Fix drag-to-first-position bug

Root cause in [vscode-ui/src/components/Sidebar/treeProjection.ts](vscode-ui/src/components/Sidebar/treeProjection.ts): when dragging onto a hovered folder (movingDown), the code derives `parentId` from the *previous sibling* folder instead of the hovered folder.

Rewrite using the canonical dnd-kit arrayMove-style projection:

1. Build `filtered` without the active node, compute `overFilteredIndex`.
2. `previousItem = filtered[overFilteredIndex - 1]`, `nextItem = filtered[overFilteredIndex + 1]` (movingDown case shifts these: `previous = filtered[overFilteredIndex]`, `next = filtered[overFilteredIndex + 1]`).
3. `projectedDepth = activeNode.depth + round(offsetX / indent)`.
4. `maxDepth = previousItem?.type === 'folder' ? previousItem.depth + 1 : previousItem.depth`; `minDepth = nextItem?.depth ?? 0`.
5. Special case: if `previousItem` is an expanded folder and `projectedDepth >= previousItem.depth + 1`, `parentId = previousItem.id` and `targetIndex = 0` (insert at start of that folder's children).
6. Otherwise walk up `previousItem` ancestry to find the parent at `depth - 1`.
7. Compute `targetIndex` by counting already-placed siblings of `parentId` in `filtered` slice up to insertion point.

This handles "drop on folderB → first child of folderB" correctly while preserving existing same-parent reordering.

## 4. Replace reload with collapse-all

- Add reducer `collapseAll` to [vscode-ui/src/store/slices/collectionsSlice.ts](vscode-ui/src/store/slices/collectionsSlice.ts) that sets `state.expandedIds = {}`.
- In [vscode-ui/src/components/Sidebar/SidebarHeader.tsx](vscode-ui/src/components/Sidebar/SidebarHeader.tsx), swap `RefreshCw` for `ChevronsDownUp` (or `ListCollapse`) from lucide and dispatch `collapseAll()`.

## 5. Persist sidebar width in localStorage

File: [vscode-ui/src/context/workbenchReducer.ts](vscode-ui/src/context/workbenchReducer.ts).

- Read keys `sidebar:width` and `sidebar:hidden` during `INITIAL_STATE` initialization (guard with `typeof window !== 'undefined'`). Clamp width between `SIDEBAR_MIN` and `SIDEBAR_MAX`.
- Write on `SET_SIDEBAR_WIDTH`, `SET_SIDEBAR_HIDDEN`, and `TOGGLE_SIDEBAR` either inline in the reducer (side-effect but simple) or via a small `useEffect` inside [vscode-ui/src/context/WorkbenchContext.tsx](vscode-ui/src/context/WorkbenchContext.tsx). Prefer the effect-based approach to keep the reducer pure.

## 6. Persist collections tree in IndexedDB

- Add dependency with yarn: `idb-keyval` (tiny, promise-based).
- New file `vscode-ui/src/store/persistence.ts` exporting `loadCollections()` and `saveCollections(state)`, keyed as `collections:v1`.
- Update [vscode-ui/src/store/index.ts](vscode-ui/src/store/index.ts):
  - Accept a `preloadedState` for `collections` and call `configureStore({ preloadedState })`.
  - Subscribe to the store; when `state.collections` changes, debounce-save (≈250ms) to IndexedDB.
- App bootstrap in [vscode-ui/src/main.tsx](vscode-ui/src/main.tsx): `await loadCollections()` before mounting `<App />`. Fallback to `INITIAL_COLLECTIONS` when no record exists.

## 7. Right-click context menu (shadcn)

- Install: `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-dialog` (yarn).
- Add shadcn primitives:
  - `vscode-ui/src/components/ui/context-menu.tsx` (standard shadcn wrapper)
  - `vscode-ui/src/components/ui/dialog.tsx` for the delete modal
- New component `vscode-ui/src/components/Sidebar/NodeContextMenu.tsx` wrapping each row with `<ContextMenu>`. Items:
  - Folder: Add request (`FilePlus`), Add folder (`FolderPlus`), separator, Rename (`Pencil`), Delete (`Trash2`, `text-destructive`)
  - Request: Rename, separator, Delete
- Hook it into [vscode-ui/src/components/Sidebar/CollectionNode.tsx](vscode-ui/src/components/Sidebar/CollectionNode.tsx) so right-click on a row opens the menu for that node.

## 8. Inline rename

- Add local state `renamingId: string | null` in [vscode-ui/src/components/Sidebar/CollectionTree.tsx](vscode-ui/src/components/Sidebar/CollectionTree.tsx), pass down `renaming`, `onStartRename`, `onCommitRename`, `onCancelRename` to `CollectionNode`.
- In `CollectionNode.tsx`, when `renaming === true`, replace the `.tree-row__label` span with a VS Code-like `<input>`:
  - Autofocus + select all on mount
  - `onKeyDown`: Enter → commit, Escape → cancel
  - `onBlur`: commit
  - Empty / unchanged → cancel
  - While editing, drag listeners are disabled (don't spread `listeners`/`attributes`)
- Trigger via Context Menu "Rename" and via F2 when a node is selected.

## 9. Delete confirmation modal

- Reusable `vscode-ui/src/components/ui/confirm-dialog.tsx` built on shadcn Dialog.
- Owned by `CollectionTree` so a single dialog instance is reused. State: `{ open: boolean, nodeId: string | null, nodeName: string }`.
- Title: `Delete "{name}"?` · Body: `This action cannot be undone.` · Buttons: Cancel, Delete (destructive).
- On confirm dispatch `deleteNode(nodeId)`.

## 10. Keyboard polish (small, keeps UX cohesive)

- Selected + F2 → rename
- Selected + Delete → open confirm dialog

## Proposed execution order (todos below)

Grouped to keep each step independently testable.

## Out of scope / deferred

- No changes to the editor area or tabs.
- No migration code for older IndexedDB schemas (we'll ship `collections:v1`).
- Keyboard shortcuts are global; we can later scope them to when sidebar has focus if needed.