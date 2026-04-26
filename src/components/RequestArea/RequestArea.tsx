import { memo, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectNode } from '../../store/slices/collectionsSlice';
import { TabBar } from './TabBar';
import { TabWorkspace } from './Workspace/TabWorkspace';
import { EmptyTabsState } from './Workspace/EmptyTabsState';
import './RequestArea.css';

function RequestAreaComponent() {
  const dispatch = useAppDispatch();
  const tabs = useAppSelector((state) => state.requestTabs.tabs);
  const activeTabId = useAppSelector((state) => state.requestTabs.activeTabId);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? null,
    [tabs, activeTabId],
  );

  useEffect(() => {
    dispatch(selectNode(activeTab?.requestId ?? null));
  }, [activeTab?.requestId, dispatch]);

  return (
    <div className="request-area" id="request-area">
      <TabBar />
      {activeTab ? <TabWorkspace tab={activeTab} /> : <EmptyTabsState />}
    </div>
  );
}

export const RequestArea = memo(RequestAreaComponent);
