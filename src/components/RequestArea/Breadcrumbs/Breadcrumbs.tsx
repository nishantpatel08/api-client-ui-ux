import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import type { CollectionNode, RequestTab } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getNodePath } from '../../../utils/tree';
import { renameNode } from '../../../store/slices/collectionsSlice';
import {
  renameTab,
  syncRequestName,
} from '../../../store/slices/requestTabsSlice';
import './Breadcrumbs.css';

interface BreadcrumbsProps {
  tab: RequestTab;
}

function BreadcrumbsComponent({ tab }: BreadcrumbsProps) {
  const dispatch = useAppDispatch();
  const tree = useAppSelector((state) => state.collections.tree);

  const path: CollectionNode[] = tab.requestId
    ? getNodePath(tree, tab.requestId)
    : [];
  const ancestors = path.length > 0 ? path.slice(0, -1) : [];

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const committedRef = useRef(false);

  useEffect(() => {
    if (!isEditing) return;
    const input = inputRef.current;
    if (!input) return;
    committedRef.current = false;
    input.value = tab.name;
    input.focus();
    input.select();
  }, [isEditing, tab.name]);

  const commit = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;
    const raw = inputRef.current?.value ?? '';
    const trimmed = raw.trim();
    setIsEditing(false);
    if (!trimmed || trimmed === tab.name) return;
    dispatch(renameTab({ id: tab.id, name: trimmed }));
    if (tab.requestId) {
      dispatch(renameNode({ id: tab.requestId, name: trimmed }));
      dispatch(syncRequestName({ requestId: tab.requestId, name: trimmed }));
    }
  }, [dispatch, tab.id, tab.name, tab.requestId]);

  const cancel = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    const input = inputRef.current;
    if (!input) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && input.contains(event.target)) return;
      commit();
    };
    const timer = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown, true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [isEditing, commit]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        event.preventDefault();
        commit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        cancel();
      }
    },
    [commit, cancel],
  );

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <span className="breadcrumbs__icon" aria-hidden="true">
        <Folder className="breadcrumbs__icon-svg" />
      </span>
      {ancestors.map((node) => (
        <span key={node.id} className="breadcrumbs__segment">
          <span className="breadcrumbs__crumb">{node.name}</span>
          <ChevronRight
            className="breadcrumbs__sep"
            aria-hidden="true"
          />
        </span>
      ))}

      {isEditing ? (
        <input
          ref={inputRef}
          className="breadcrumbs__input"
          defaultValue={tab.name}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          spellCheck={false}
          aria-label="Rename request"
        />
      ) : (
        <button
          type="button"
          className="breadcrumbs__current"
          onClick={handleStartEdit}
          title="Click to rename"
        >
          {tab.name}
        </button>
      )}
    </nav>
  );
}

export const Breadcrumbs = memo(BreadcrumbsComponent);
