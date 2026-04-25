import type { HttpMethod } from './collections';

export type PanelOrientation = 'column' | 'row';

export interface RequestTabDraft {
  requestId: string;
  name: string;
  method: HttpMethod;
  url: string;
  body: string;
  response: string;
}

export interface WorkspaceTab {
  id: string;
  requestId: string;
}

export interface WorkspaceState {
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  orientation: PanelOrientation;
  draftsByRequestId: Record<string, RequestTabDraft>;
}
