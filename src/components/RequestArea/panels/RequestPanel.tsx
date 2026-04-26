import { memo, useCallback } from 'react';
import type {
  RequestBodyMode,
  RequestDraftTab,
  RequestTab,
} from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import {
  setTabBody,
  setTabBodyMode,
  setTabDraftTab,
} from '../../../store/slices/requestTabsSlice';
import { cn } from '../../../utils/classNames';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { BodyEditor } from './BodyEditor';
import { PlaceholderView } from './PlaceholderView';
import './RequestPanel.css';

interface RequestPanelProps {
  tab: RequestTab;
}

const DRAFT_TABS: { id: RequestDraftTab; label: string; counter?: (t: RequestTab) => number | undefined }[] = [
  {
    id: 'body',
    label: 'Body',
    counter: (t) => (t.body && t.bodyMode !== 'none' ? 1 : undefined),
  },
  {
    id: 'query',
    label: 'Query',
    counter: (t) => t.queryParams.filter((p) => p.enabled).length || undefined,
  },
  {
    id: 'header',
    label: 'Header',
    counter: (t) => t.headers.filter((p) => p.enabled).length || undefined,
  },
  { id: 'auth', label: 'Auth' },
  { id: 'script', label: 'Script' },
  { id: 'docs', label: 'Docs' },
];

function RequestPanelComponent({ tab }: RequestPanelProps) {
  const dispatch = useAppDispatch();

  const handleTabChange = useCallback(
    (next: string) =>
      dispatch(
        setTabDraftTab({ id: tab.id, draftTab: next as RequestDraftTab }),
      ),
    [dispatch, tab.id],
  );

  const handleBodyChange = useCallback(
    (body: string) => dispatch(setTabBody({ id: tab.id, body })),
    [dispatch, tab.id],
  );

  const handleBodyModeChange = useCallback(
    (bodyMode: RequestBodyMode) =>
      dispatch(setTabBodyMode({ id: tab.id, bodyMode })),
    [dispatch, tab.id],
  );

  return (
    <div className="request-panel">
      <Tabs
        value={tab.activeDraftTab}
        onValueChange={handleTabChange}
        className={cn('request-panel__tabs')}
      >
        <TabsList variant="line" className="request-panel__list">
          {DRAFT_TABS.map((t) => {
            const count = t.counter?.(tab);
            return (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="request-panel__trigger"
              >
                <span>{t.label}</span>
                {count ? (
                  <span className="request-panel__trigger-dot" aria-hidden="true" />
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="body" className="request-panel__content">
          <BodyEditor
            mode={tab.bodyMode}
            value={tab.body}
            onChange={handleBodyChange}
            onModeChange={handleBodyModeChange}
          />
        </TabsContent>
        <TabsContent value="query" className="request-panel__content">
          <PlaceholderView label="Query parameters" />
        </TabsContent>
        <TabsContent value="header" className="request-panel__content">
          <PlaceholderView label="Headers" />
        </TabsContent>
        <TabsContent value="auth" className="request-panel__content">
          <PlaceholderView label="Authorization" />
        </TabsContent>
        <TabsContent value="script" className="request-panel__content">
          <PlaceholderView label="Pre-request script" />
        </TabsContent>
        <TabsContent value="docs" className="request-panel__content">
          <PlaceholderView label="Documentation" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const RequestPanel = memo(RequestPanelComponent);
