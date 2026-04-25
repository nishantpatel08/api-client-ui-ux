import type { ActivityBarItem } from '../types';
import {
  ACTIVITY_COLLECTIONS,
  ACTIVITY_ENVIRONMENTS,
  ACTIVITY_HISTORY,
  ACTIVITY_SCM,
  ACTIVITY_SEARCH,
  ACTIVITY_SETTINGS,
} from './constants';

export const ACTIVITY_BAR_ITEMS: ActivityBarItem[] = [
  {
    id: ACTIVITY_COLLECTIONS,
    title: 'Collections',
    icon: 'collections',
    position: 'top',
  },
  {
    id: ACTIVITY_SEARCH,
    title: 'Search',
    icon: 'search',
    position: 'top',
  },
  {
    id: ACTIVITY_ENVIRONMENTS,
    title: 'Environments',
    icon: 'environments',
    position: 'top',
  },
  {
    id: ACTIVITY_SCM,
    title: 'Source Control',
    icon: 'scm',
    position: 'top',
  },
  {
    id: ACTIVITY_HISTORY,
    title: 'History',
    icon: 'history',
    position: 'top',
  },
  {
    id: ACTIVITY_SETTINGS,
    title: 'Settings',
    icon: 'settings',
    position: 'bottom',
  },
];

export const ACTIVITY_ICON_MAP: Record<string, string> = {
  collections: 'files',
  search: 'search',
  environments: 'layers',
  scm: 'source-control',
  history: 'history',
  settings: 'settings-gear',
};
