import { memo } from 'react';
import { MonacoEditor } from '@/components/ui/monaco-editor';
import { useAppDispatch } from '@/store/hooks';
import { updateRequestBody } from '@/store/slices/workspaceSlice';
import type { PanelOrientation, RequestTabDraft } from '@/types/workspace';

interface RequestResponsePanelsProps {
  request: RequestTabDraft;
  orientation: PanelOrientation;
}

function RequestResponsePanelsComponent({
  request,
  orientation,
}: RequestResponsePanelsProps) {
  return (
    <div
      className="request-response-panels"
      data-orientation={orientation}
    >
      <RequestPanel request={request} />
      <ResponsePanel request={request} />
    </div>
  );
}

function RequestPanel({ request }: { request: RequestTabDraft }) {
  const dispatch = useAppDispatch();
  return (
    <section className="request-response-panel">
      <div className="request-response-panel__header">
        <span className="request-response-panel__title">Request</span>
      </div>
      <div className="request-response-panel__editor">
        <MonacoEditor
          language="json"
          value={request.body}
          onChange={(value) =>
            dispatch(updateRequestBody({ requestId: request.requestId, body: value }))
          }
        />
      </div>
    </section>
  );
}

function ResponsePanel({ request }: { request: RequestTabDraft }) {
  const preview =
    request.response ||
    `Send request to see response here`;

  return (
    <section className="request-response-panel">
      <div className="request-response-panel__header">
        <span className="request-response-panel__title">Response</span>
      </div>
      <div className="request-response-panel__editor">
        <MonacoEditor language="json" value={preview} readOnly />
      </div>
    </section>
  );
}

export const RequestResponsePanels = memo(RequestResponsePanelsComponent);
