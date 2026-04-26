import { memo } from 'react';
import type { RequestTab } from '../../../types';
import { useWorkbench } from '../../../hooks/useWorkbench';
import { Breadcrumbs } from '../Breadcrumbs';
import { RequestBar } from '../RequestBar';
import { PanelSplit } from '../PanelSplit/PanelSplit';
import { RequestPanel } from '../panels/RequestPanel';
import { ResponsePanel } from '../panels/ResponsePanel';
import './TabWorkspace.css';

interface TabWorkspaceProps {
  tab: RequestTab;
}

function TabWorkspaceComponent({ tab }: TabWorkspaceProps) {
  const { state } = useWorkbench();

  return (
    <div className="tab-workspace">
      <Breadcrumbs tab={tab} />
      <RequestBar tab={tab} />
      <PanelSplit
        layout={state.panelLayout}
        first={<RequestPanel tab={tab} />}
        second={<ResponsePanel tab={tab} />}
      />
    </div>
  );
}

export const TabWorkspace = memo(TabWorkspaceComponent);
