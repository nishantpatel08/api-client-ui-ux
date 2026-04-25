import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { renameNode } from '@/store/slices/collectionsSlice';
import { updateRequestName } from '@/store/slices/workspaceSlice';
import type { RequestTabDraft } from '@/types/workspace';

interface RequestBreadcrumbProps {
  request: RequestTabDraft;
}

function RequestBreadcrumbComponent({ request }: RequestBreadcrumbProps) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(request.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const commit = useCallback(() => {
    const nextName = value.trim();
    setEditing(false);
    if (!nextName || nextName === request.name) return;
    dispatch(renameNode({ id: request.requestId, name: nextName }));
    dispatch(updateRequestName({ requestId: request.requestId, name: nextName }));
  }, [dispatch, request.name, request.requestId, value]);

  return (
    <div className="request-breadcrumb">
      <span className="request-breadcrumb__scope">Bridge</span>
      <span className="request-breadcrumb__separator">/</span>
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit();
            if (event.key === 'Escape') {
              setEditing(false);
              setValue(request.name);
            }
          }}
          className="request-breadcrumb__input"
          aria-label="Rename request"
        />
      ) : (
        <button
          type="button"
          className="request-breadcrumb__name"
          onClick={() => {
            setValue(request.name);
            setEditing(true);
          }}
        >
          {request.name}
        </button>
      )}
    </div>
  );
}

export const RequestBreadcrumb = memo(RequestBreadcrumbComponent);
