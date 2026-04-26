import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { PanelLayout } from '../../../types';
import { clamp } from '../../../utils/clamp';
import { REQUEST_PANEL_MIN_PX } from '../../../data/constants';
import { cn } from '../../../utils/classNames';
import './PanelSplit.css';

interface PanelSplitProps {
  layout: PanelLayout;
  first: ReactNode;
  second: ReactNode;
  /** Initial ratio of first panel (0..1). Defaults to 0.5. */
  defaultRatio?: number;
}

function PanelSplitComponent({
  layout,
  first,
  second,
  defaultRatio = 0.5,
}: PanelSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(clamp(defaultRatio, 0.1, 0.9));
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef<{ ratio: number; pos: number } | null>(null);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const pos = layout === 'columns' ? event.clientX : event.clientY;
      dragStartRef.current = { ratio, pos };
      setDragging(true);
      document.body.style.cursor =
        layout === 'columns' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    },
    [layout, ratio],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: PointerEvent) => {
      const start = dragStartRef.current;
      const container = containerRef.current;
      if (!start || !container) return;
      const rect = container.getBoundingClientRect();
      const total = layout === 'columns' ? rect.width : rect.height;
      const pos = layout === 'columns' ? event.clientX : event.clientY;
      const delta = pos - start.pos;
      const minFraction = REQUEST_PANEL_MIN_PX / total;
      const next = clamp(
        start.ratio + delta / total,
        minFraction,
        1 - minFraction,
      );
      setRatio(next);
    };

    const handleUp = () => {
      setDragging(false);
      dragStartRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging, layout]);

  const firstPct = `${(ratio * 100).toFixed(3)}%`;
  const secondPct = `${((1 - ratio) * 100).toFixed(3)}%`;

  return (
    <div
      ref={containerRef}
      className={cn(
        'panel-split',
        layout === 'columns'
          ? 'panel-split--columns'
          : 'panel-split--rows',
      )}
    >
      <div
        className="panel-split__pane"
        data-dimension={layout === 'columns' ? firstPct : undefined}
        style={
          layout === 'columns'
            ? { width: firstPct, height: '100%' }
            : { height: firstPct, width: '100%' }
        }
      >
        {first}
      </div>
      <div
        role="separator"
        aria-orientation={layout === 'columns' ? 'vertical' : 'horizontal'}
        className={cn(
          'panel-split__sash',
          layout === 'columns'
            ? 'panel-split__sash--v'
            : 'panel-split__sash--h',
          dragging && 'panel-split__sash--dragging',
        )}
        onPointerDown={handlePointerDown}
      />
      <div
        className="panel-split__pane"
        style={
          layout === 'columns'
            ? { width: secondPct, height: '100%' }
            : { height: secondPct, width: '100%' }
        }
      >
        {second}
      </div>
    </div>
  );
}

export const PanelSplit = memo(PanelSplitComponent);
