import { memo } from 'react';

interface PaneActionsProps {
  canClose: boolean;
  canReopen: boolean;
  onReopen?: () => void;
  onClose?: () => void;
}

function PaneActionsComponent({
  canClose,
  canReopen,
  onReopen,
  onClose,
}: PaneActionsProps) {
  return (
    <div className="pane-actions">
      {canReopen ? (
        <button
          type="button"
          className="pane-btn"
          title="Open Split Editor"
          aria-label="Open Split Editor"
          onClick={onReopen}
        >
          ⧉
        </button>
      ) : null}
      <button
        type="button"
        className="pane-btn"
        title="Split Editor Right"
        aria-label="Split Editor Right"
      >
        ⧉
      </button>
      {canClose ? (
        <button
          type="button"
          className="pane-btn pane-btn--close"
          title="Close Split"
          aria-label="Close Split"
          onClick={onClose}
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export const PaneActions = memo(PaneActionsComponent);
