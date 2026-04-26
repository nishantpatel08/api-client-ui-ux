import { memo, useCallback, type ChangeEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HttpMethod, RequestTab } from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import {
  setTabResponse,
  setTabMethod,
  setTabUrl,
} from '../../../store/slices/requestTabsSlice';
import { MethodSelect } from './MethodSelect';
import './RequestBar.css';

interface RequestBarProps {
  tab: RequestTab;
  onSend?: (tab: RequestTab) => void;
}

function RequestBarComponent({ tab, onSend }: RequestBarProps) {
  const dispatch = useAppDispatch();

  const handleMethodChange = useCallback(
    (method: HttpMethod) => dispatch(setTabMethod({ id: tab.id, method })),
    [dispatch, tab.id],
  );

  const handleUrlChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      dispatch(setTabUrl({ id: tab.id, url: event.target.value })),
    [dispatch, tab.id],
  );

  const handleSend = useCallback(() => {
    if (onSend) {
      onSend(tab);
      return;
    }

    const responseBody =
      tab.bodyMode === 'json' && tab.body.trim().length > 0
        ? tab.body
        : JSON.stringify(
            {
              requestName: tab.name,
              method: tab.method,
              url: tab.url || 'http://localhost:8000/api/admin/roundtrips.v2/',
              message: 'Mock response preview. API integration comes next.',
            },
            null,
            2,
          );

    dispatch(
      setTabResponse({
        id: tab.id,
        response: {
          status: 200,
          statusText: 'OK',
          timeMs: 168,
          sizeBytes: new Blob([responseBody]).size,
          body: responseBody,
          contentType: 'application/json',
        },
      }),
    );
  }, [dispatch, onSend, tab]);

  return (
    <div className="request-bar">
      <div className="request-bar__group">
        <MethodSelect value={tab.method} onChange={handleMethodChange} />
        <input
          type="text"
          className="request-bar__url"
          value={tab.url}
          onChange={handleUrlChange}
          placeholder="Enter URL or paste text"
          spellCheck={false}
          aria-label="Request URL"
        />
      </div>
      <div className="request-bar__send-group">
        <button
          type="button"
          className="request-bar__send"
          onClick={handleSend}
          aria-label="Send request"
        >
          Send
        </button>
        <button
          type="button"
          className="request-bar__send-split"
          aria-label="Send options"
        >
          <ChevronDown className="request-bar__send-split-icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export const RequestBar = memo(RequestBarComponent);
