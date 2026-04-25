import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { EditorPane as EditorPaneType } from '../../types';
import { useWorkbench } from '../../hooks/useWorkbench';
import { FILES } from '../../data/codeSnippets';
import { getFileIcon } from '../../utils/fileIcons';
import { cn } from '../../utils/classNames';
import { Tab } from './Tab';
import { PaneActions } from './PaneActions';
import { Breadcrumbs } from './Breadcrumbs';
import { CodeView } from './CodeView';
import { Minimap } from './Minimap';
import './EditorPane.css';

interface EditorPaneProps {
  pane: EditorPaneType;
  focused: boolean;
  hidden: boolean;
  canClose: boolean;
  canReopen: boolean;
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as React.RefObject<T | null>).current = node;
    }
  };
}

const EditorPaneComponent = forwardRef<HTMLDivElement, EditorPaneProps>(
  function EditorPane({ pane, focused, hidden, canClose, canReopen }, ref) {
    const { dispatch } = useWorkbench();
    const localRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const node = localRef.current;
      if (!node) return;
      node.style.flexGrow = String(pane.size);
    }, [pane.size]);

    const activeTab = useMemo(
      () => pane.tabs.find((tab) => tab.id === pane.activeTabId),
      [pane.tabs, pane.activeTabId],
    );

    const activeFile = activeTab ? FILES[activeTab.fileId] : undefined;

    const handleFocus = useCallback(() => {
      if (!focused) dispatch({ type: 'FOCUS_PANE', paneId: pane.id });
    }, [dispatch, focused, pane.id]);

    const handleActivateTab = useCallback(
      (tabId: string) => {
        dispatch({ type: 'SET_ACTIVE_TAB', paneId: pane.id, tabId });
      },
      [dispatch, pane.id],
    );

    const handleCloseTab = useCallback(
      (tabId: string) => {
        dispatch({ type: 'CLOSE_TAB', paneId: pane.id, tabId });
      },
      [dispatch, pane.id],
    );

    const handleClosePane = useCallback(() => {
      dispatch({ type: 'CLOSE_PANE', paneId: pane.id });
    }, [dispatch, pane.id]);

    const handleReopenPane = useCallback(() => {
      const hiddenIds = pane.id === 'pane-1' ? ['pane-2'] : ['pane-1'];
      for (const id of hiddenIds) {
        dispatch({ type: 'REOPEN_PANE', paneId: id });
      }
    }, [dispatch, pane.id]);

    return (
      <section
        ref={mergeRefs(ref, localRef)}
        data-hidden={hidden ? 'true' : 'false'}
        className={cn('editor-pane', focused && 'editor-pane--focused')}
        onMouseDown={handleFocus}
        aria-label={`Editor group ${pane.id}`}
      >
        <div className="pane-tabs" role="tablist">
          {pane.tabs.map((tab) => {
            const file = FILES[tab.fileId];
            return (
              <Tab
                key={tab.id}
                id={tab.id}
                label={file?.label ?? tab.fileId}
                icon={getFileIcon(file?.icon ?? 'file')}
                active={tab.id === pane.activeTabId}
                onActivate={handleActivateTab}
                onClose={handleCloseTab}
              />
            );
          })}
          <PaneActions
            canClose={canClose}
            canReopen={canReopen}
            onClose={handleClosePane}
            onReopen={handleReopenPane}
          />
        </div>

        {activeFile ? (
          <>
            <Breadcrumbs segments={activeFile.breadcrumbs} />
            <div className="pane-code-area">
              <CodeView lines={activeFile.lines} />
              <Minimap lines={activeFile.lines} />
            </div>
          </>
        ) : null}
      </section>
    );
  },
);

export const EditorPane = memo(EditorPaneComponent);
