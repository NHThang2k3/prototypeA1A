// Path: src/pages/location-management/data.ts

import type { LocationNode } from './types';

export const warehouseData: LocationNode = {
  id: 'FBWH',
  name: 'Kho Vải (FBWH)',
  type: 'WAREHOUSE',
  status: 'ACTIVE',
  items: [],
  children: [
    {
      id: 'FBWH-A',
      name: 'Khu A',
      type: 'ZONE',
      status: 'ACTIVE',
      items: [],
      children: [
        {
          id: 'FBWH-A-01',
          name: 'Dãy 01',
          type: 'AISLE',
          status: 'ACTIVE',
          items: [],
          children: [
            {
              id: 'FBWH-A-01-S1',
              name: 'Kệ 01-S1',
              type: 'SHELF',
              status: 'ACTIVE',
              capacity: 10,
              items: [
                { id: 'ROLL-001', sku: 'FAB-001', name: 'Vải Cotton Xanh', quantity: 2, uom: 'Cây' },
                { id: 'ROLL-002', sku: 'FAB-002', name: 'Vải Kate Trắng', quantity: 3, uom: 'Cây' },
              ],
              children: [],
            },
            {
              id: 'FBWH-A-01-S2',
              name: 'Kệ 01-S2',
              type: 'SHELF',
              status: 'LOCKED',
              capacity: 10,
              items: [],
              children: [],
            },
          ],
        },
        {
          id: 'FBWH-A-02',
          name: 'Dãy 02',
          type: 'AISLE',
          status: 'ACTIVE',
          items: [],
          children: [],
        }
      ],
    },
    {
      id: 'FBWH-B',
      name: 'Khu B',
      type: 'ZONE',
      status: 'ACTIVE',
      items: [],
      children: [],
    }
  ],
};