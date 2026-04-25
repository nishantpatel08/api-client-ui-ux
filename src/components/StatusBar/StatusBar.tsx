import { memo } from 'react';
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

const LEFT_ITEMS = [
  { id: 'branch', label: 'Git branch', content: '⎇ main' },
  { id: 'problems', label: 'Problems', content: '⚠ 0  ⛔ 0' },
] as const;

const RIGHT_ITEMS = [
  { id: 'language', label: 'Language', content: 'TypeScript' },
  { id: 'cursor', label: 'Cursor position', content: 'Ln 42, Col 18' },
  { id: 'indent', label: 'Indent', content: 'Spaces: 2' },
  { id: 'encoding', label: 'Encoding', content: 'UTF-8' },
  { id: 'eol', label: 'End of Line', content: 'LF' },
  { id: 'formatter', label: 'Formatter', content: 'Prettier' },
  { id: 'notifications', label: 'Notifications', content: '🔔' },
] as const;

function StatusBarComponent() {
  return (
    <footer className="status-bar" role="status" aria-label="Status Bar">
      {LEFT_ITEMS.map((item) => (
        <StatusItem key={item.id} label={item.label}>
          {item.content}
        </StatusItem>
      ))}

      <div className="status-bar__right">
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
