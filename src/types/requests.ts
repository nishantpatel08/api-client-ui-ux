import type { HttpMethod } from './collections';

export type RequestBodyMode = 'none' | 'json' | 'text' | 'xml';

export interface KeyValueEntry {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export type RequestDraftTab = 'body' | 'query' | 'header' | 'auth' | 'script' | 'docs';
export type ResponseViewTab = 'preview' | 'header' | 'request' | 'tests' | 'timeline';

export interface ResponseState {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  body: string;
  contentType: string;
}

export interface RequestTab {
  /** Stable tab id (= source request id when opened from a collection). */
  id: string;
  /** Optional id of the matching collection request. null for new unsaved tabs. */
  requestId: string | null;
  name: string;
  method: HttpMethod;
  url: string;
  bodyMode: RequestBodyMode;
  body: string;
  headers: KeyValueEntry[];
  queryParams: KeyValueEntry[];
  /** Which inner panel tab is active (body/query/header...). */
  activeDraftTab: RequestDraftTab;
  /** Which response inner tab is active. */
  activeResponseTab: ResponseViewTab;
  /** Latest response, if any. */
  response: ResponseState | null;
  dirty: boolean;
}
