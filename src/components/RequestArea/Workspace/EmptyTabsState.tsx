import { memo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '../../../store/hooks';
import { createDraftTabAction } from '../../../store/slices/requestTabsSlice';
import './EmptyTabsState.css';

function EmptyTabsStateComponent() {
  const dispatch = useAppDispatch();
  const handleCreate = useCallback(
    () => dispatch(createDraftTabAction()),
    [dispatch],
  );

  return (
    <div className="empty-tabs">
      <div className="empty-tabs__inner">
        <p className="empty-tabs__title">No request open</p>
        <p className="empty-tabs__hint">
          Pick a request from the sidebar, drag one to the tab bar, or
        </p>
        <button
          type="button"
          className="empty-tabs__button"
          onClick={handleCreate}
        >
          <Plus className="empty-tabs__icon" />
          Create a new request
        </button>
      </div>
    </div>
  );
}

export const EmptyTabsState = memo(EmptyTabsStateComponent);
