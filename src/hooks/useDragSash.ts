import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface DragContext {
  startX: number;
  startY: number;
}

export interface UseDragSashOptions {
  onStart?: (ctx: DragContext) => void;
  onMove: (deltaX: number, deltaY: number, ctx: DragContext) => void;
  onEnd?: (ctx: DragContext) => void;
  cursor?: string;
}

export interface UseDragSashResult {
  dragging: boolean;
  onMouseDown: (event: React.MouseEvent) => void;
}

export function useDragSash(options: UseDragSashOptions): UseDragSashResult {
  const [dragging, setDragging] = useState(false);
  const ctxRef = useRef<DragContext | null>(null);

  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  });

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const ctx: DragContext = { startX: event.clientX, startY: event.clientY };
    ctxRef.current = ctx;
    setDragging(true);
    document.body.style.cursor = optionsRef.current.cursor ?? 'col-resize';
    document.body.style.userSelect = 'none';
    optionsRef.current.onStart?.(ctx);
  }, []);

  useEffect(() => {
    if (!dragging) return undefined;

    const handleMove = (event: MouseEvent) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      optionsRef.current.onMove(
        event.clientX - ctx.startX,
        event.clientY - ctx.startY,
        ctx,
      );
    };

    const handleUp = () => {
      const ctx = ctxRef.current;
      setDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (ctx) optionsRef.current.onEnd?.(ctx);
      ctxRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  return { dragging, onMouseDown };
}
