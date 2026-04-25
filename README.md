# Rest Fox UI

A Postman-like API testing tool UI built with React + Vite, organised as a VSCode-inspired workbench (activity bar, resizable sidebar, editor area, status bar).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (utilities only, preflight disabled) for shadcn-style primitives
- shadcn-style components (hand-rolled under `src/components/ui`) - no `sidebar`/`resizable` primitives; those stay hand-written
- `lucide-react` for all icons
- `@dnd-kit/core` + `@dnd-kit/sortable` for the collections tree drag-and-drop
- `@reduxjs/toolkit` + `react-redux` for the collections slice
- Plain CSS for layout (workbench grid, activity bar, sidebar, sash, header). Tailwind is only used inside shadcn primitives.

## Scripts

```bash
yarn dev
yarn build
yarn lint
yarn preview
```

## Architecture

```
src/
├── components/
│   ├── ui/                 shadcn-style primitives (Input, IconButton)
│   ├── Header/             Logo + SearchBar + HeaderActions
│   ├── ActivityBar/        lucide icons + CSS
│   ├── Sidebar/            CollectionTree + CollectionNode + MethodBadge
│   ├── Sash/               resize handle
│   ├── EditorArea/         (legacy demo pane - to be replaced by tabs/request/response panels)
│   ├── StatusBar/
│   └── Workbench/          top-level layout
├── context/                WorkbenchContext for layout UI state (sidebar/activity/panes)
├── store/                  Redux Toolkit store (collectionsSlice only)
├── hooks/                  useWorkbench, useDragSash, useSidebarLayout
├── data/                   constants, initialCollections, activityBarItems
├── types/                  CollectionNode + HttpMethod + layout types
├── utils/                  cn() (clsx + tailwind-merge), clamp, tree helpers, fileIcons
└── styles/                 variables.css, global.css, tailwind.css
```

### State split

Layout UI state (sidebar width, sidebar hidden, active activity, panes) stays in `WorkbenchContext` + `useReducer`. The request/collection tree (folders, requests, expanded set, selection) lives in a Redux Toolkit slice at `src/store/slices/collectionsSlice.ts`.

### Collections tree

- Tree is a nested `CollectionNode[]` where each node is either a `folder` (with `children`) or a `request` (with `method`).
- `src/utils/tree.ts` offers `findNode`, `removeNode`, `insertNode`, `updateNode`, `isDescendant`, `flattenVisible`.
- DnD flattens the visible portion, wraps it in `DndContext` + `SortableContext`, and computes a `DropProjection { parentId, targetIndex, depth }` during `onDragMove` using pointer-x indentation (pattern inspired by the @dnd-kit sortable-tree example).
- On drop, the slice's `moveNode` action applies the move, guarding against dropping a folder inside its own descendants.

### Path alias

Vite + TypeScript are configured so `@/...` maps to `src/...`.
