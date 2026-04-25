export type TokenKind =
  | 'kw'
  | 'str'
  | 'cmt'
  | 'fn'
  | 'var'
  | 'num'
  | 'tp'
  | 'punc'
  | 'text';

export interface Token {
  kind: TokenKind;
  value: string;
}

export type CodeLine = Token[];

export interface FileContent {
  id: string;
  label: string;
  icon: string;
  language: string;
  breadcrumbs: string[];
  lines: CodeLine[];
}

export interface TabItem {
  id: string;
  fileId: string;
  dirty?: boolean;
}

export interface EditorPane {
  id: string;
  tabs: TabItem[];
  activeTabId: string;
  size: number;
}

export interface ActivityBarItem {
  id: string;
  title: string;
  icon: string;
  position: 'top' | 'bottom';
}

export * from './collections';
export * from './workspace';
