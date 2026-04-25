import { memo, useCallback, useMemo, useRef } from 'react';
import { useWorkbench } from '../../hooks/useWorkbench';
import { useDragSash } from '../../hooks/useDragSash';
import { SPLIT_PANE_MIN } from '../../data/constants';
import { clamp } from '../../utils/clamp';
import { Sash } from '../Sash';
import { EditorPane } from './EditorPane';
import './EditorArea.css';

function EditorAreaComponent() {
  const { state, dispatch } = useWorkbench();
  const { panes, hiddenPaneIds, focusedPaneId } = state;

  const pane1 = panes[0];
  const pane2 = panes[1];

  const pane1Ref = useRef<HTMLDivElement>(null);
  const pane2Ref = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef<{ w1: number; w2: number }>({ w1: 0, w2: 0 });

  const isPane1Hidden = hiddenPaneIds.includes(pane1.id);
  const isPane2Hidden = hiddenPaneIds.includes(pane2.id);
  const bothVisible = !isPane1Hidden && !isPane2Hidden;

  const handleDragStart = useCallback(() => {
    dragStartRef.current = {
      w1: pane1Ref.current?.offsetWidth ?? 0,
      w2: pane2Ref.current?.offsetWidth ?? 0,
    };
  }, []);

  const handleDragMove = useCallback(
    (deltaX: number) => {
      const { w1, w2 } = dragStartRef.current;
      const total = w1 + w2;
      if (total === 0) return;
      const nextW1 = clamp(w1 + deltaX, SPLIT_PANE_MIN, total - SPLIT_PANE_MIN);
      const nextW2 = total - nextW1;
      if (pane1Ref.current) pane1Ref.current.style.flexGrow = String(nextW1);
      if (pane2Ref.current) pane2Ref.current.style.flexGrow = String(nextW2);
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    const w1 = pane1Ref.current?.offsetWidth ?? 1;
    const w2 = pane2Ref.current?.offsetWidth ?? 1;
    dispatch({
      type: 'SET_PANE_SIZES',
      sizes: { [pane1.id]: w1, [pane2.id]: w2 },
    });
  }, [dispatch, pane1.id, pane2.id]);

  const { dragging, onMouseDown } = useDragSash({
    onStart: handleDragStart,
    onMove: handleDragMove,
    onEnd: handleDragEnd,
  });

  const canClose = useMemo(
    () => panes.length - hiddenPaneIds.length > 1,
    [panes.length, hiddenPaneIds.length],
  );

  return (
    <div className="editor-area" id="editor-area">
      <div className="editor-content" id="editor-content">
        <EditorPane
          ref={pane1Ref}
          pane={pane1}
          focused={focusedPaneId === pane1.id}
          hidden={isPane1Hidden}
          canClose={canClose && !isPane1Hidden}
          canReopen={isPane2Hidden}
        />

        {bothVisible ? (
          <Sash
            dragging={dragging}
            onMouseDown={onMouseDown}
            aria-label="Resize editor split"
          />
        ) : null}

        <EditorPane
          ref={pane2Ref}
          pane={pane2}
          focused={focusedPaneId === pane2.id}
          hidden={isPane2Hidden}
          canClose={canClose && !isPane2Hidden}
          canReopen={isPane1Hidden}
        />
      </div>
    </div>
  );
}

export const EditorArea = memo(EditorAreaComponent);
