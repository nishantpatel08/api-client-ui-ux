import type { CollectionNode } from '../types';

export const INITIAL_COLLECTIONS: CollectionNode[] = [
  {
    id: 'col-stage',
    type: 'folder',
    name: 'Stage',
    children: [
      {
        id: 'req-stage-new',
        type: 'request',
        name: 'New Request',
        method: 'POST',
      },
    ],
  },
  {
    id: 'col-crea-tr',
    type: 'folder',
    name: 'Crea tr page',
    children: [
      {
        id: 'req-crea-tr-testing',
        type: 'request',
        name: 'Testing the api 4 asdaas',
        method: 'GET',
      },
    ],
  },
  {
    id: 'col-partner-portal',
    type: 'folder',
    name: 'Partner Portal',
    children: [
      {
        id: 'col-marketplace',
        type: 'folder',
        name: 'marketplace',
        children: [
          {
            id: 'col-spot-trs',
            type: 'folder',
            name: 'spot-trs',
            children: [
              {
                id: 'req-spot-list',
                type: 'request',
                name: 'List spot TRs',
                method: 'GET',
              },
              {
                id: 'req-spot-create',
                type: 'request',
                name: 'Create spot TR',
                method: 'POST',
              },
            ],
          },
          {
            id: 'req-filters-data',
            type: 'request',
            name: 'filters-data',
            method: 'GET',
          },
          {
            id: 'req-saved-searches',
            type: 'request',
            name: 'saved-searches',
            method: 'GET',
          },
        ],
      },
    ],
  },
  {
    id: 'col-admin-portal',
    type: 'folder',
    name: 'Admin Portal',
    children: [
      {
        id: 'col-transport-request',
        type: 'folder',
        name: 'Transport Request',
        children: [
          {
            id: 'col-standard',
            type: 'folder',
            name: 'standard',
            children: [
              {
                id: 'req-create-tr',
                type: 'request',
                name: 'Create TR',
                method: 'POST',
              },
              {
                id: 'req-check-intermodal',
                type: 'request',
                name: 'Check Intermodal',
                method: 'POST',
              },
              {
                id: 'col-intermodal',
                type: 'folder',
                name: 'intermodal',
                children: [
                  {
                    id: 'req-intermodal-create',
                    type: 'request',
                    name: 'Create intermodal TR',
                    method: 'POST',
                  },
                ],
              },
            ],
          },
          {
            id: 'req-validate-ltl',
            type: 'request',
            name: 'Validate ltl sub tr',
            method: 'POST',
          },
          {
            id: 'req-new-request',
            type: 'request',
            name: 'New Request',
            method: 'GET',
          },
        ],
      },
      {
        id: 'col-partner',
        type: 'folder',
        name: 'partner',
        children: [],
      },
      {
        id: 'col-customer',
        type: 'folder',
        name: 'customer',
        children: [],
      },
      {
        id: 'col-tr-page',
        type: 'folder',
        name: 'Tr page',
        children: [],
      },
    ],
  },
  {
    id: 'col-customer-portal',
    type: 'folder',
    name: 'Customer Portal',
    children: [
      {
        id: 'req-navi',
        type: 'request',
        name: 'navi',
        method: 'POST',
      },
      {
        id: 'req-price-suggestions',
        type: 'request',
        name: 'Price suggestions',
        method: 'POST',
      },
      {
        id: 'req-roundtrips',
        type: 'request',
        name: 'roundtrips_v2',
        method: 'POST',
      },
      {
        id: 'req-delay',
        type: 'request',
        name: 'Delay',
        method: 'GET',
      },
    ],
  },
];

export const INITIAL_EXPANDED_IDS: Record<string, boolean> = {
  'col-stage': true,
  'col-crea-tr': true,
  'col-partner-portal': true,
  'col-marketplace': true,
  'col-spot-trs': true,
  'col-admin-portal': true,
  'col-transport-request': true,
  'col-standard': true,
  'col-customer-portal': true,
};
