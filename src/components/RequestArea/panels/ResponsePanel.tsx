import { memo, useCallback } from 'react';
import { History } from 'lucide-react';
import type { RequestTab, ResponseViewTab } from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import { setTabResponseTab } from '../../../store/slices/requestTabsSlice';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { MonacoBlock } from '../editor/MonacoBlock';
import '../editor/monacoBlock.css';
import './ResponsePanel.css';

interface ResponsePanelProps {
  tab: RequestTab;
}

const RESPONSE_TABS: { id: ResponseViewTab; label: string }[] = [
  { id: 'preview', label: 'Preview' },
  { id: 'header', label: 'Header' },
  { id: 'request', label: 'Request' },
  { id: 'tests', label: 'Tests' },
  { id: 'timeline', label: 'Timeline' },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ResponsePanelComponent({ tab }: ResponsePanelProps) {
  const dispatch = useAppDispatch();

  const handleTabChange = useCallback(
    (next: string) =>
      dispatch(
        setTabResponseTab({
          id: tab.id,
          responseTab: next as ResponseViewTab,
        }),
      ),
    [dispatch, tab.id],
  );

  if (!tab.response) {
    return (
      <div className="response-panel response-panel--empty">
        <div className="response-panel__empty-inner">
          <p className="response-panel__empty-text">
            Send request to see response here
          </p>
        </div>
      </div>
    );
  }

  const status = tab.response.status;
  const statusClass =
    status >= 200 && status < 300
      ? 'response-panel__status--ok'
      : status >= 300 && status < 400
        ? 'response-panel__status--warn'
        : 'response-panel__status--err';

  return (
    <div className="response-panel">
      <Tabs
        value={tab.activeResponseTab}
        onValueChange={handleTabChange}
        className="response-panel__tabs"
      >
        <div className="response-panel__bar">
          <TabsList variant="line" className="response-panel__list">
            {RESPONSE_TABS.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="response-panel__trigger"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <button type="button" className="response-panel__history">
            <History className="response-panel__history-icon" />
            History
          </button>
          <div className="response-panel__meta">
            <span className={`response-panel__status ${statusClass}`}>
              {tab.response.status} {tab.response.statusText}
            </span>
            <span className="response-panel__time">
              {tab.response.timeMs} ms
            </span>
            <span className="response-panel__size">
              {formatSize(tab.response.sizeBytes)}
            </span>
          </div>
        </div>

        <TabsContent value="preview" className="response-panel__content">
          <MonacoBlock
            value={tab.response.body}
            language="json"
            readOnly
          />
        </TabsContent>
        <TabsContent value="header" className="response-panel__content">
          <div className="response-panel__placeholder">Headers view</div>
        </TabsContent>
        <TabsContent value="request" className="response-panel__content">
          <div className="response-panel__placeholder">Raw request</div>
        </TabsContent>
        <TabsContent value="tests" className="response-panel__content">
          <div className="response-panel__placeholder">Tests</div>
        </TabsContent>
        <TabsContent value="timeline" className="response-panel__content">
          <div className="response-panel__placeholder">Timeline</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const ResponsePanel = memo(ResponsePanelComponent);
