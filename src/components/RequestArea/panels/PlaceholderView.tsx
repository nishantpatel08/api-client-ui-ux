import { memo } from 'react';
import './PlaceholderView.css';

interface PlaceholderViewProps {
  label: string;
}

function PlaceholderViewComponent({ label }: PlaceholderViewProps) {
  return (
    <div className="placeholder-view">
      <p className="placeholder-view__text">{label} coming soon</p>
    </div>
  );
}

export const PlaceholderView = memo(PlaceholderViewComponent);
