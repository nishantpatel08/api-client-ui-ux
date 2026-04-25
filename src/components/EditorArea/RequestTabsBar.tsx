import { memo, useCallback } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HttpMethod } from '@/types';
import type { RequestTabDraft, WorkspaceTab } from '@/types/workspace';
import { useAppDispatch } from '@/store/hooks';
import { openRequestTab } from '@/store/slices/workspaceSlice';

interface RequestTabsBarProps {
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  draftsByRequestId: Record<string, RequestTabDraft>;
  onActivate: (tabId: string) => void;
  onClose: (tabId: string) => void;
}

function RequestTabsBarComponent({
  tabs,
  activeTabId,
  draftsByRequestId,
  onActivate,
  onClose,
}: RequestTabsBarProps) {
  const dispatch = useAppDispatch();

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const serialized = event.dataTransfer.getData('application/restfox-request');
      if (!serialized) return;
      try {
        const parsed = JSON.parse(serialized) as {
          requestId: string;
          name: string;
          method: HttpMethod;
        };
        dispatch(
          openRequestTab({
            requestId: parsed.requestId,
            name: parsed.name,
            method: parsed.method,
          }),
        );
      } catch {
        // ignore invalid drags
      }
    },
    [dispatch],
  );

  return (
    <div
      className="request-tabs-bar"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <Tabs
        value={activeTabId ?? undefined}
        onValueChange={onActivate}
        className="request-tabs-bar__tabs"
      >
        <TabsList variant="line" className="request-tabs-bar__list">
          {tabs.map((tab) => {
            const request = draftsByRequestId[tab.requestId];
            const label = request?.name ?? tab.requestId;
            const method = request?.method ?? 'GET';
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="request-tabs-bar__trigger"
              >
                <span className="request-tabs-bar__method">{method}</span>
                <span className="request-tabs-bar__label">{label}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="request-tabs-bar__close"
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    onClose(tab.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    event.stopPropagation();
                    onClose(tab.id);
                  }}
                  aria-label={`Close ${label}`}
                >
                  <X size={12} />
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

export const RequestTabsBar = memo(RequestTabsBarComponent);
