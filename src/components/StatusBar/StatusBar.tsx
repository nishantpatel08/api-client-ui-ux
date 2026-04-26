import { memo, type ReactNode } from 'react';
import { Columns2, Rows2 } from 'lucide-react';
import { useWorkbench } from '../../hooks/useWorkbench';
import './StatusBar.css';

interface StatusItemProps {
  children: ReactNode;
  label?: string;
}

function StatusItem({ children, label }: StatusItemProps) {
  return (
    <button type="button" className="status-item" aria-label={label}>
      {children}
    </button>
  );
}

const LEFT_ITEMS = [
  { id: 'branch', label: 'Git branch', content: '⎇ main' },
  { id: 'problems', label: 'Problems', content: '⚠ 0  ⛔ 0' },
] as const;

const RIGHT_ITEMS = [
  { id: 'encoding', label: 'Encoding', content: 'UTF-8' },
  { id: 'notifications', label: 'Notifications', content: '🔔' },
] as const;

function StatusBarComponent() {
  const { state, dispatch } = useWorkbench();
  const isColumns = state.panelLayout === 'columns';

  return (
    <footer className="status-bar" role="status" aria-label="Status Bar">
      {LEFT_ITEMS.map((item) => (
        <StatusItem key={item.id} label={item.label}>
          {item.content}
        </StatusItem>
      ))}

      <div className="status-bar__right">
        <button
          type="button"
          className="status-item status-item--layout"
          aria-label="Toggle request response panel layout"
          title={
            isColumns
              ? 'Switch to stacked request/response panels'
              : 'Switch to side-by-side request/response panels'
          }
          onClick={() => dispatch({ type: 'TOGGLE_PANEL_LAYOUT' })}
        >
          {isColumns ? (
            <Columns2 className="status-item__icon" aria-hidden="true" />
          ) : (
            <Rows2 className="status-item__icon" aria-hidden="true" />
          )}
          <span>{isColumns ? 'Columns' : 'Rows'}</span>
        </button>
        {RIGHT_ITEMS.map((item) => (
          <StatusItem key={item.id} label={item.label}>
            {item.content}
          </StatusItem>
        ))}
      </div>
    </footer>
  );
}

export const StatusBar = memo(StatusBarComponent);
