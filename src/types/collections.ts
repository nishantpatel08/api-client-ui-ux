export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export const HTTP_METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
];

export interface CollectionFolder {
  id: string;
  type: 'folder';
  name: string;
  children: CollectionNode[];
}

export interface CollectionRequest {
  id: string;
  type: 'request';
  name: string;
  method: HttpMethod;
}

export type CollectionNode = CollectionFolder | CollectionRequest;

export interface FlatCollectionNode {
  id: string;
  parentId: string | null;
  depth: number;
  index: number;
  node: CollectionNode;
}
