import { memo } from 'react';
import { Columns2, Rows2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOrientation } from '@/store/slices/workspaceSlice';
import './StatusBar.css';

interface StatusItemProps {
  children: React.ReactNode;
  label?: string;
}

function StatusItem({ children, label }: StatusItemProps) {
  return (
    <button type="button" className="status-item" aria-label={label}>
      {children}
    </button>
  );
}

function StatusBarComponent() {
  const dispatch = useAppDispatch();
  const orientation = useAppSelector((state) => state.workspace.orientation);

  return (
    <footer className="status-bar" role="status" aria-label="Status Bar">
      <StatusItem label="Current environment">Dev</StatusItem>
      <StatusItem label="Layout view">
        {orientation === 'column' ? 'Columns' : 'Rows'}
      </StatusItem>

      <div className="status-bar__right">
        <button
          type="button"
          className="status-item"
          onClick={() => dispatch(setOrientation('column'))}
          aria-label="Switch to column view"
          data-active={orientation === 'column' ? 'true' : undefined}
        >
          <Columns2 size={14} />
          Columns
        </button>
        <button
          type="button"
          className="status-item"
          onClick={() => dispatch(setOrientation('row'))}
          aria-label="Switch to row view"
          data-active={orientation === 'row' ? 'true' : undefined}
        >
          <Rows2 size={14} />
          Rows
        </button>
      </div>
    </footer>
  );
}

export const StatusBar = memo(StatusBarComponent);
