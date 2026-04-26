export interface ActivityBarItem {
  id: string;
  title: string;
  icon: string;
  position: 'top' | 'bottom';
}

export * from './collections';
export * from './requests';
export * from './layout';
