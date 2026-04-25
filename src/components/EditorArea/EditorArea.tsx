import { memo, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectNode } from '@/store/slices/collectionsSlice';
import { activateTab, closeTab } from '@/store/slices/workspaceSlice';
import { RequestBar } from './RequestBar';
import { RequestBreadcrumb } from './RequestBreadcrumb';
import { RequestResponsePanels } from './RequestResponsePanels';
import { RequestTabsBar } from './RequestTabsBar';
import './EditorArea.css';

function EditorAreaComponent() {
  const dispatch = useAppDispatch();
  const workspace = useAppSelector((state) => state.workspace);
  const activeTab = useMemo(
    () => workspace.tabs.find((tab) => tab.id === workspace.activeTabId),
    [workspace.activeTabId, workspace.tabs],
  );
  const activeRequest = useMemo(() => {
    if (!activeTab) return null;
    return workspace.draftsByRequestId[activeTab.requestId] ?? null;
  }, [activeTab, workspace.draftsByRequestId]);

  useEffect(() => {
    if (!activeTab) return;
    dispatch(selectNode(activeTab.requestId));
  }, [activeTab, dispatch]);

  return (
    <div className="editor-area" id="editor-area">
      <RequestTabsBar
        tabs={workspace.tabs}
        activeTabId={workspace.activeTabId}
        draftsByRequestId={workspace.draftsByRequestId}
        onActivate={(tabId) => dispatch(activateTab({ tabId }))}
        onClose={(tabId) => dispatch(closeTab({ tabId }))}
      />

      {activeRequest ? (
        <div className="editor-content" id="editor-content">
          <RequestBreadcrumb key={activeRequest.requestId} request={activeRequest} />
          <RequestBar request={activeRequest} />
          <RequestResponsePanels request={activeRequest} orientation={workspace.orientation} />
        </div>
      ) : (
        <div className="editor-empty-state">
          <p className="editor-empty-state__text">
            Open a request from the sidebar to start editing.
          </p>
        </div>
      )}
    </div>
  );
}

export const EditorArea = memo(EditorAreaComponent);
